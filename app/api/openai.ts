export async function getIssueSummary(issueBody: string): Promise<string> {
    const response = await fetch('http://localhost:4000/api/openai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: issueBody }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch issue summary');
    }

    const data = await response.json();
    return data.completion;
}