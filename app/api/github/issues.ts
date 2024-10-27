import { Octokit } from "octokit";
import { Endpoints } from "@octokit/types";
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_PAT = process.env.GITHUB_PAT;

const octokit = new Octokit({
    auth: GITHUB_PAT,
});

export type IssuesResponse = Endpoints["GET /repos/{owner}/{repo}/issues"]["response"];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const page = searchParams.get('page');

    try {
        const issues = await fetchIssues({ owner: owner as string, repo: repo as string }, Number(page) || 1);
        return NextResponse.json(issues, { status: 200 });
    } catch (error) {
        console.error("Error fetching issues:", error);
        return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const { title, body } = await req.json();

    try {
        const newIssue = await createIssue({ owner: owner as string, repo: repo as string }, title, body);
        return NextResponse.json(newIssue, { status: 201 });
    } catch (error) {
        console.error("Error creating issue:", error);
        return NextResponse.json({ error: "Failed to create issue" }, { status: 500 });
    }
}

const fetchIssues = async (repo: { owner: string, repo: string }, page: number): Promise<IssuesResponse["data"]> => {
    const response: IssuesResponse = await octokit.request("GET /repos/{owner}/{repo}/issues", {
        ...repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
        state: "open",
        per_page: 30,
        page: page
    });

    return response.data;
};

const createIssue = async (repo: { owner: string, repo: string }, title: string, body: string) => {
    const response = await octokit.request("POST /repos/{owner}/{repo}/issues", {
        ...repo,
        title,
        body,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });

    return response.data;
};
