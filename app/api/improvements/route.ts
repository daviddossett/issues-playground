import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { z } from 'zod';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const ImprovementProposal = z.object({
    items: z.array(z.object({
        type: z.enum(['rewrite', 'discrete']),
        original: z.string(),
        proposed: z.string(),
        reasoning: z.string(),
    })),
});

const systemPrompt = `
- You are an expert in helping users refine GitHub Issues to ensure clarity, completeness, and alignment with the repository maintainer's guidelines.
- Keep improvements focused and actionable.
- Format all responses following the ImprovementProposal schema.
- Keep reasoning to 10 words or less.
- CRITICAL: When suggesting improvements:
  * The 'original' field must be an exact substring of the issue text
  * Do not modify punctuation, spacing, or capitalization in the 'original' field
  * Do not add periods or other punctuation that isn't in the source text
  * Verify that your 'original' selection exists in the input text before suggesting it
`;

const assistantPrompt = `
- First, analyze if the issue needs a complete rewrite to match the guidelines structure.
- If a rewrite is needed, provide **one** rewrite as the first improvement with type: 'rewrite'
- When analyzing content for discrete improvements:
  - If this is a rewritten issue, focus on improving clarity and specific content details
  - Make specific, focused suggestions that can be applied independently
  - Make suggestions for removing certain text if it is irrelevant or redundant
  `

export async function POST(req: Request) {
    const { issueBody, issueGuidelines } = await req.json();

    try {
        const response = await openai.beta.chat.completions.parse({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                }, {
                    role: "assistant",
                    content: assistantPrompt,
                },
                {
                    role: "user", content: `Provide improvements for this issue body: ${issueBody} using these guidelines: ${issueGuidelines}.`
                },
            ],
            max_tokens: 1200,
            response_format: zodResponseFormat(ImprovementProposal, "improvements_extraction"),
            store: true,
        });

        const content = response.choices[0].message.parsed;
        if (!content) {
            throw new Error("Response content is null");
        }

        // Validate improvements before returning them
        const validatedImprovements = {
            items: content.items.filter(improvement => {
                // Verify each improvement's original text exists in the issue body
                const exists = issueBody.includes(improvement.original);
                if (!exists) {
                    console.warn("Filtered out improvement with non-matching original text:", improvement);
                }
                return exists;
            })
        };

        return new Response(JSON.stringify(validatedImprovements), { status: 200 });
    } catch (error) {
        console.error("Error fetching improvements:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch improvements" }), { status: 500 });
    }
}
