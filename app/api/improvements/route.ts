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
- The improvements are based on a issue guidelines file that the repo maintainer has provided.
- Don't fully rewrite the issue.
- Generate >=1 discrete proposed edits. Proposed edits should be based off the general shape and language of the "good" issue in the issue guideline provided. 
- DO NOT suggest edits or rewrites that repeat the actual content of the example issues. 
- If applicable, propose edits that change the users original text to fit the formats shown in the issue example. E.g. Suggest a "steps to reproduce" edit that fills out the skeleton (e.g. Steps to reproduce: 1) /n 2) /n 3) ...) of that section for them for a partial ordered list, even if they haven't provided all the details yet.
- The reasoning for the proposed edit should be echoed from the provided guidelines word for word in the response. 
- If the proposed edit is to remove the text, return "" (an empty string).
`;

export async function POST(req: Request) {
    const { issueBody, issueTemplate } = await req.json();

    try {
        const response = await openai.beta.chat.completions.parse({
            model: "gpt-4o-mini",
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
