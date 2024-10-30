import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { z } from 'zod';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const ImprovementProposal = z.object({
    items: z.array(z.object({
        original: z.string(),
        proposed: z.string(),
        reasoning: z.string(),
    })),
});

const systemPrompt = `
- You are an expert at helping users refine a draft of GitHub Issue that they are writing. Your goal will be to propose rewrites of specific sections of the issue that could be improved.
- The improvements are based on issue guideline that the repo maintainer has provided.
- Generate >=2 discrete proposed edits
- The reasoning for the proposed edit should be echoed from the provided guidelines word for word in the response. 
- Response text should be in markdown. Use new lines (\n\n) before adding section headers like ## Description or [Suggestion] to ensure proper formatting.

An example of an original piece of text describing an problem that could be improved:
THIS LAYOUT IS TOTALLY BROKEN 😡. The code goes right off the screen so I can't see it.

An example of a proposed improvement: 
## Description

The generated CSS overflows off the screen so I can't easily read it or copy it. /n/n[Suggestion: describe where on the screen this happens or include a screenshot]
`;

export async function POST(req: Request) {
    const { issueBody, issueGuidelines } = await req.json();

    try {
        const response = await openai.beta.chat.completions.parse({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                { role: "user", content: `Issue Body: ${issueBody}\nIssue Guidlines from Repo: ${issueGuidelines || ''}` },
            ],
            max_tokens: 800,
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
