import { Octokit } from "octokit";
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_PAT = process.env.GITHUB_PAT;

const octokit = new Octokit({
    auth: GITHUB_PAT,
});

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const path = searchParams.get('path');

    try {
        const content = await fetchFileContent({ owner: owner as string, repo: repo as string }, path as string);
        return NextResponse.json(content, { status: 200 });
    } catch (error) {
        console.error("Error fetching file content:", error);
        return NextResponse.json({ error: "Failed to fetch file content" }, { status: 500 });
    }
}

const fetchFileContent = async (repo: { owner: string, repo: string }, path: string) => {
    const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        ...repo,
        path,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });

    return response.data;
};
