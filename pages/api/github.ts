import { Octokit } from "octokit";
import { Endpoints } from "@octokit/types";
import { NextApiRequest, NextApiResponse } from 'next';

const GITHUB_PAT = process.env.GITHUB_PAT;

const octokit = new Octokit({
    auth: GITHUB_PAT,
});

type IssuesResponse = Endpoints["GET /repos/{owner}/{repo}/issues"]["response"];
type RepoDetailsResponse = Endpoints["GET /repos/{owner}/{repo}"]["response"];
type UserResponse = Endpoints["GET /users/{username}"]["response"];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { endpoint, username, page, owner, repo } = req.query;

    try {
        if (endpoint === "issues") {
            const issues = await fetchIssues({ owner: owner as string, repo: repo as string }, Number(page) || 1);
            res.status(200).json(issues);
        } else if (endpoint === "repo") {
            const repoDetails = await fetchRepoDetails({ owner: owner as string, repo: repo as string });
            res.status(200).json(repoDetails);
        } else if (endpoint === "avatar" && typeof username === "string") {
            const avatarUrl = await fetchUserAvatarUrl(username);
            res.status(200).json({ avatar_url: avatarUrl });
        } else {
            res.status(400).json({ error: "Invalid endpoint" });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
}

const fetchIssues = async (repo: { owner: string, repo: string }, page: number): Promise<IssuesResponse["data"]> => {
    let issues: IssuesResponse["data"] = [];
    let currentPage = page;

    while (issues.length < 30) {
        const response: IssuesResponse = await octokit.request("GET /repos/{owner}/{repo}/issues", {
            ...repo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            },
            state: "open",
            per_page: 30, // the gh endpoint includes PRs *and* issues in one list so fetch the max possible per page
            page: currentPage
        });

        const filteredIssues = response.data.filter(issue => !issue.pull_request);
        issues = issues.concat(filteredIssues);

        if (response.data.length < 30) {
            // If we fetched less than 75 items, it means there are no more issues to fetch
            break;
        }

        currentPage++;
    }

    return issues.slice(0, 30); // Return only the first 30 issues
};

const fetchRepoDetails = async (repo: { owner: string, repo: string }): Promise<RepoDetailsResponse["data"]> => {
    const response: RepoDetailsResponse = await octokit.request("GET /repos/{owner}/{repo}", {
        ...repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });
    return response.data;
};

const fetchUserAvatarUrl = async (username: string): Promise<string> => {
    const response: UserResponse = await octokit.request('GET /users/{username}', {
        username: username,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });
    return response.data.avatar_url;
};

