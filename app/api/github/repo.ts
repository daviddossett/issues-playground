import { Octokit } from "octokit";
import { Endpoints } from "@octokit/types";
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_PAT = process.env.GITHUB_PAT;

const octokit = new Octokit({
    auth: GITHUB_PAT,
});

export type RepoDetailsResponse = Endpoints["GET /repos/{owner}/{repo}"]["response"];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');

    try {
        const repoDetails = await fetchRepoDetails({ owner: owner as string, repo: repo as string });
        return NextResponse.json(repoDetails, { status: 200 });
    } catch (error) {
        console.error("Error fetching repo details:", error);
        return NextResponse.json({ error: "Failed to fetch repo details" }, { status: 500 });
    }
}

const fetchRepoDetails = async (repo: { owner: string, repo: string }): Promise<RepoDetailsResponse["data"]> => {
    const response: RepoDetailsResponse = await octokit.request("GET /repos/{owner}/{repo}", {
        ...repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });
    return response.data;
};
