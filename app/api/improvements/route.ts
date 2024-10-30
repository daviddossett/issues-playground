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
- You are an expert in helping users refine GitHub Issues to ensure clarity, completeness, and alignment with the repository maintainer's guidelines.
- Carefully read both the issue body and the provided issue guidelines. For any section lacking key information (e.g., steps to reproduce, expected vs. actual results, environment), recommend specific additions to make the issue actionable and understandable for maintainers.
- Provide **one or more** specific proposed edits to improve readability, clarity, or completeness. Focus on:
  1. Clarity of language and structure.
  2. Consistency with guidelines.
  3. Actionability (e.g., clear reproduction steps, environment details).
- Use exact phrasing from the guidelines where applicable in your rationale for each proposed edit. Provide a **[Suggestion]** section at the end if any missing information would make the issue easier to understand or reproduce.
- Format the response in markdown. Use line breaks (\n\n) to separate sections like ## Description and [Suggestion] for clear readability.
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
