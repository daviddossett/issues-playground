import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { issueBody } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an assistant that creates concise summaries of GitHub issues. Keep it to one or two short sentences. Use 2-3 short bullets to illustrate the main points if the issue is long enough to warrant it." },
                { role: "user", content: issueBody }
            ],
            max_tokens: 200,
        });
        res.status(200).json({ summary: response.choices[0].message.content });
    } catch (error) {
        console.error("Error fetching issue summary:", error);
        res.status(500).json({ error: "Failed to fetch issue summary" });
    }
}