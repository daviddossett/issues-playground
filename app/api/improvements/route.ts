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

    const systemPrompt = `You are an expert in helping users refine GitHub Issues to ensure clarity, completeness, and alignment with the repository maintainer's guidelines. Keep improvements focused and actionable. Format all responses following the ImprovementProposal schema. Keep reasoning to 10 words or less.
        `;

    const userPrompt1 = `Here are the guidelines from the repo: ${issueGuidelines} Here's the issue body: ${issueBody}`;

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
