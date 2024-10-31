import { useState, useCallback } from "react";
import { fetchImprovements } from "@/app/client";

export interface Improvement {
    type: 'rewrite' | 'discrete';
    original: string;
    proposed: string;
    reasoning: string;
}

export const useImproveIssue = (issueBody: string, issueGuidelines: string | null) => {
    const [improvements, setImprovements] = useState<Improvement[] | null>(null);
    const [improvementsLoading, setImprovementsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchIssueImprovements = useCallback(async (bodyOverride?: string) => {
        setImprovementsLoading(true);
        setError(null);
        try {
            const data = await fetchImprovements(bodyOverride || issueBody, issueGuidelines);
            if (data?.items) {
                setImprovements(data.items);
            }
            return data;
        } catch (error) {
            console.error("Failed to fetch improvements:", error);
            setError("Failed to fetch improvements");
            return null;
        } finally {
            setImprovementsLoading(false);
        }
    }, [issueBody, issueGuidelines]);

    return { improvements, improvementsLoading, error, fetchIssueImprovements, setImprovements };
};
