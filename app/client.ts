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
    const hasMore = data.length === 30; // Assuming 30 is the per_page limit
    return { issues: data, hasMore };
}

export async function fetchIssueSummary(issueBody: string) {
    const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ issueBody }),
    });

    if (!response.ok) {
        const errorText = await response.text(); // Capture error response text
        console.error("Failed to fetch issue summary:", errorText); // Log the error response
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

export async function createIssue(repo: Repo, title: string, body: string) {
    const response = await fetch(`/api/github?endpoint=issues&owner=${repo.owner}&repo=${repo.name}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, body })
    });

    if (!response.ok) {
        throw new Error("Failed to create issue");
    }

    const data = await response.json();
    return data;
}

export async function fetchFileContent(repo: Repo, path: string) {
    const response = await fetch(`/api/github?endpoint=content&owner=${repo.owner}&repo=${repo.name}&path=${path}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch file content");
    }

    const data = await response.json();
    return atob(data.content); // GitHub API returns base64 encoded content
}

export async function fetchImprovements(issueBody: string, issueTemplate: string | null) {
    const response = await fetch("/api/improvements", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ issueBody, issueTemplate }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch improvements");
    }

    const data = await response.json();
    return data;
}
