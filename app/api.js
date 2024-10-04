// api.js
import { Octokit } from "octokit";

const repo = {
    owner: "daviddossett",
    repo: "grid-playground",
};

const octokit = new Octokit({
    auth: process.env.GITHUB_PAT,
});

export const fetchIssues = async () => {
    const response = await octokit.request("GET /repos/{owner}/{repo}/issues", repo);
    return response.data;
};

export const fetchRepoDetails = async () => {
    const response = await octokit.request("GET /repos/{owner}/{repo}", repo);
    return response.data;
};

export async function getUserAvatarUrl(username) {
    const response = await octokit.request('GET /users/{username}', {
        username: username,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });
    return response.data.avatar_url;
}