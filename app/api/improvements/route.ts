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

export async function POST(req: Request) {
    const { issueBody, issueGuidelines } = await req.json();

    const systemPrompt = `You are an expert in helping users refine GitHub Issues to ensure clarity, completeness, and alignment with the repository maintainer's guidelines. Keep improvements focused and actionable. Format all responses following the ImprovementProposal schema. Keep reasoning to 10 wo
        `;

    const userPrompt1 = `Here are the guidelines from the repo: ${issueGuidelines}.`

    const userPrompt2 = `Here's the issue body: ${issueBody}`;

    const userPrompt3 = `"Let's think step by step: First, carefully analyze if the issue needs a complete rewrite to match the guidelines structure. If a rewrite is needed, provide one rewrite as the first improvement with type: 'rewrite'. Skip this step if the issue already matches the example in the provided guidelines. Analyzing the issue content to find discrete improvements: If this is a rewritten issue, focus on improving clarity and specific content details. Take special care to not miss any vague words or phrases that might have suitable replacements in the issue guidelines. Make specific, focused suggestions that can be applied independently. Return an empty string for any suggestions that involve removing the original text based on the guidelines. CRITICAL: When suggesting improvements: The 'original' field must be an exact substring of the issue text. Do not modify punctuation, spacing, or capitalization in the 'original' field. Do not add periods or other punctuation that isn't in the source text. Verify that your 'original' selection exists in the input text before suggesting it as an improvement."`

    const userPrompt4 = `Suggest improvements for the provided issue.`

    try {
        const response = await openai.beta.chat.completions.parse({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt1,
                },
                {
                    role: "user",
                    content: userPrompt2,
                },
                {
                    role: "user",
                    content: userPrompt4,
                },
                {
                    role: "user", content: userPrompt3
                },
            ],
            max_tokens: 2048,
            temperature: 0.70,
            response_format: zodResponseFormat(ImprovementProposal, "improvements_extraction"),
            store: true,
        });

        const content = response.choices[0].message.parsed;
        if (!content) {
            throw new Error("Response content is null");
        }


        const validatedImprovements = {
            items: content.items.filter(improvement => {
                const exists = issueBody.includes(improvement.original);
                if (!exists) {
                    console.warn("Filtered out improvement with non-matching original text:", improvement);
                }
                return exists;
            })
        };

        console.log(validatedImprovements);

        return new Response(JSON.stringify(validatedImprovements), { status: 200 });
    } catch (error) {
        console.error("Error fetching improvements:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch improvements" }), { status: 500 });
    }
}
