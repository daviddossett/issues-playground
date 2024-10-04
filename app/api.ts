// api.js
import { Octokit } from "octokit";
import { Endpoints } from "@octokit/types";

const repo = {
    owner: "daviddossett",
    repo: "grid-playground",
};

const octokit = new Octokit({
    auth: process.env.GITHUB_PAT,
});

type IssuesResponse = Endpoints["GET /repos/{owner}/{repo}/issues"]["response"];
type RepoDetailsResponse = Endpoints["GET /repos/{owner}/{repo}"]["response"];
type UserResponse = Endpoints["GET /users/{username}"]["response"];

export const fetchIssues = async (): Promise<IssuesResponse["data"]> => {
    const response: IssuesResponse = await octokit.request("GET /repos/{owner}/{repo}/issues", repo);
    return response.data;
};

export const fetchRepoDetails = async (): Promise<RepoDetailsResponse["data"]> => {
    const response: RepoDetailsResponse = await octokit.request("GET /repos/{owner}/{repo}", repo);
    return response.data;
};

export async function getUserAvatarUrl(username: string): Promise<string> {
    const response: UserResponse = await octokit.request('GET /users/{username}', {
        username: username,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });
    return response.data.avatar_url;
}