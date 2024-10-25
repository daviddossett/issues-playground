import { useState, useCallback } from "react";
import { fetchImprovements } from "@/app/client";

export interface Improvement {
    original: string;
    proposed: string;
    reasoning: string;
}

export const useImproveIssue = (issueBody: string, issueTemplate: string | null) => {
    const [improvements, setImprovements] = useState<Improvement>();
    const [improvementsLoading, setImprovementsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchIssueImprovements = useCallback(async () => {
        setImprovementsLoading(true);
        setError(null);
        try {
            const data = await fetchImprovements(issueBody, issueTemplate);
            setImprovements(data.improvements);
        } catch (error) {
            console.error("Failed to fetch improvements:", error);
            setError("Failed to fetch improvements");
        } finally {
            setImprovementsLoading(false);
        }
    }, [issueBody, issueTemplate]);

    return { improvements, improvementsLoading, error, fetchIssueImprovements };
};
