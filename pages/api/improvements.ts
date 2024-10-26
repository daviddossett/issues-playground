import { NextApiRequest, NextApiResponse } from 'next';
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


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { issueBody, issueTemplate } = req.body;

    try {
        const response = await openai.beta.chat.completions.parse({
            model: "gpt-4o-2024-08-06",
            messages: [
                {
                    role: "system",
                    content: `You are an assistant that proposes an array of improvements to the body of a WIP GitHub issue that a user is writing. The improvements are based on a template that the repo maintainer has provided. I don't want a full rewrite of the issue. I want multiple discrete edits on specific parts of the issue. Keep your reasoning concise: 5 words or less.`,
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
        res.status(200).json(improvements);
    } catch (error) {
        console.error("Error fetching improvements:", error);
        res.status(500).json({ error: "Failed to fetch improvements" });
    }
}
