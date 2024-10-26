import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { z } from 'zod';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const ImprovementProposal = z.object({
    improvements: z.array(
        z.object({
            original: z.string(),
            proposed: z.string(),
            reasoning: z.string(),
        })),
});

const prompt = `
- You are an expert at helping users refine a WIP draft of GitHub Issue that they are writing. The goal will be to highlight specific sections of the issue that could be improved and allow users to accept/discard proposed improvements.
- The improvements are based on a template that the repo maintainer has provided.
- Don't fully rewrite the issue.
- Generate >=1 discrete proposed edits. Keep the proposed edits as small as possible to avoid completely rewriting the issue.
- Keep your reasoning concise: 5 words or less.
`;

export async function POST(req: Request) {
    const { issueBody, issueTemplate } = await req.json();

    try {
        const response = await openai.beta.chat.completions.parse({
            model: "gpt-4o-2024-08-06",
            messages: [
                {
                    role: "system",
                    content: prompt,
                },
                { role: "user", content: `Issue Body: ${issueBody}\nIssue Template: ${issueTemplate || ''}` },
            ],
            max_tokens: 800,
            response_format: zodResponseFormat(ImprovementProposal, "improvements_extraction"),
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
