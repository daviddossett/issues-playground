import { useState, useCallback } from "react";
import { fetchImprovements } from "@/app/client";

interface ImprovementProposal {
    improvements: [
        {
            original: string;
            proposed: string;
            reasoning: string;
        }
    ]
}


export const useImproveIssue = (issueBody: string, issueTemplate: string | null) => {
    const [improvementsList, setImprovementsList] = useState<ImprovementProposal>();
    const [improvementsListLoading, setImprovementsListLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchIssueImprovements = useCallback(async () => {
        setImprovementsListLoading(true);
        setError(null);
        try {
            const data = await fetchImprovements(issueBody, issueTemplate);
            setImprovementsList(data);
        } catch (error) {
            console.error("Failed to fetch improvements:", error);
            setError("Failed to fetch improvements");
        } finally {
            setImprovementsListLoading(false);
        }
    }, [issueBody, issueTemplate]);

    return { improvementsList, improvementsListLoading, error, fetchIssueImprovements };
};
