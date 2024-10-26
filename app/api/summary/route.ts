import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { issueBody } = await req.json();

        if (!issueBody) {
            return NextResponse.json({ error: "Missing issueBody parameter" }, { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an assistant that creates concise summaries of GitHub issues. Keep it to one or two short sentences. Use 2-3 short bullets to illustrate the main points if the issue is long enough to warrant it." },
                { role: "user", content: issueBody }
            ],
            max_tokens: 200,
        });

        const summary = response.choices[0].message.content;
        return NextResponse.json({ summary }, { status: 200 });
    } catch (error) {
        console.error("Error fetching issue summary:", error);
        return NextResponse.json({ error: "Failed to fetch issue summary" }, { status: 500 });
    }
}