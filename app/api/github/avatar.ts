import { Octokit } from "octokit";
import { Endpoints } from "@octokit/types";
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_PAT = process.env.GITHUB_PAT;

const octokit = new Octokit({
    auth: GITHUB_PAT,
});

export type UserResponse = Endpoints["GET /users/{username}"]["response"];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    try {
        const avatarUrl = await fetchUserAvatarUrl(username as string);
        return NextResponse.json({ avatar_url: avatarUrl }, { status: 200 });
    } catch (error) {
        console.error("Error fetching avatar URL:", error);
        return NextResponse.json({ error: "Failed to fetch avatar URL" }, { status: 500 });
    }
}

const fetchUserAvatarUrl = async (username: string): Promise<string> => {
    const response: UserResponse = await octokit.request('GET /users/{username}', {
        username: username,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });
    return response.data.avatar_url;
};
