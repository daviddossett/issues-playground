import { Repo } from "./page";

export async function fetchIssues(repo: Repo, page: number = 1) {
    const response = await fetch(`/api/github?endpoint=issues&owner=${repo.owner}&repo=${repo.name}&page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch issues");
    }
    const data = await response.json();
    return data;
}

export async function fetchIssueSummary(issueBody: string) {
    const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ issueBody }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch issue summary");
    }

    const data = await response.json();
    return data.summary;
}

export async function fetchAvatarUrl(username: string) {
    const response = await fetch(`/api/github?endpoint=avatar&username=${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch avatar URL");
    }

    const data = await response.json();
    return data.avatar_url;
}
