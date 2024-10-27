import { NextRequest, NextResponse } from 'next/server';
import * as issues from './issues';
import * as repo from './repo';
import * as avatar from './avatar';
import * as content from './content';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get('endpoint');

    switch (endpoint) {
        case 'issues':
            return issues.GET(req);
        case 'repo':
            return repo.GET(req);
        case 'avatar':
            return avatar.GET(req);
        case 'content':
            return content.GET(req);
        default:
            return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
    }
}

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get('endpoint');

    switch (endpoint) {
        case 'issues':
            return issues.POST(req);
        default:
            return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
    }
}
