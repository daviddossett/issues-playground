import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { issueBody, issueTemplate } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an assistant that proposes targeted improvements to GitHub issues based on a given template. Provide the original text, proposed improvement, and reasoning.",
                },
                { role: "user", content: `Issue Body: ${issueBody}\nIssue Template: ${issueTemplate || ''}` },
            ],
            max_tokens: 500, // Increase tokens if multiple proposals are expected
        });

        const improvements = response.choices[0].message.content;
        res.status(200).json({ improvements });
    } catch (error) {
        console.error("Error fetching improvements:", error);
        res.status(500).json({ error: "Failed to fetch improvements" });
    }
}
