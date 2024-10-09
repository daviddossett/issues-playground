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
            messages: [{ role: "user", content: `Create a concise summary of the github issue for based on the content of ${issueBody}. Don't add a bold "summary of github issue" blurb at the top. Keep it to one or two short sentences.` }],
            max_tokens: 200,
        });
        res.status(200).json({ summary: response.choices[0].message.content });
    } catch (error) {
        console.error("Error fetching issue summary:", error);
        res.status(500).json({ error: "Failed to fetch issue summary" });
    }
}