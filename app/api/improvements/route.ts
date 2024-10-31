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
- First, analyze if the issue needs a complete rewrite to match the guidelines structure.
- If a rewrite is needed, provide **one** rewrite as the first improvement with type: 'rewrite'.
- When analyzing content for discrete improvements:
  - If this is a rewritten issue, focus on improving clarity and specific content details
  - Ensure all original text references exactly match the content being improved
  - Make specific, focused suggestions that can be applied independently
  - Make suggestions for removing certain text if it is irrelevant or redundant
- Keep improvements focused and actionable.
- Format all responses following the ImprovementProposal schema.
- Keep reasoning to 10 words or less.
`;

export async function POST(req: Request) {
    const { issueBody, issueGuidelines } = await req.json();

    try {
        const response = await openai.beta.chat.completions.parse({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                { role: "user", content: `Issue Body: ${issueBody}\nIssue Guidlines from Repo: ${issueGuidelines || ''}` },
            ],
            max_tokens: 1200,
            response_format: zodResponseFormat(ImprovementProposal, "improvements_extraction"),
            store: true
        });

        const content = response.choices[0].message.parsed;
        if (!content) {
            throw new Error("Response content is null");
        }
        const improvements = content;
        return new Response(JSON.stringify(improvements), { status: 200 });
    } catch (error) {
        console.error("Error fetching improvements:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch improvements" }), { status: 500 });
    }
}
