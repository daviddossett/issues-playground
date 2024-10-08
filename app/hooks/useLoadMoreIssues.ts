import { useState, useEffect } from "react";
import { fetchIssues } from "../client";
import { Issue } from "../page";

export const useLoadMoreIssues = (initialIssues: Issue[]) => {
    const [issues, setIssues] = useState<Issue[]>(initialIssues);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setIssues(initialIssues);
    }, [initialIssues]);

    const loadMoreIssues = async () => {
        try {
            const nextPage = page + 1;
            console.log("Fetching issues for page:", nextPage);

            const moreIssues = await fetchIssues(nextPage);
            console.log("Fetched issues:", moreIssues);

            // Filter out any issues that are already in the state
            const newIssues = moreIssues.filter(
                (newIssue: { id: number }) =>
                    !issues.some((issue) => issue.id === newIssue.id)
            );

            setIssues((prevIssues) => [...prevIssues, ...newIssues]);
            setPage(nextPage);
        } catch (error) {
            console.error("Error fetching more issues:", error);
        }
    };

    return { issues, loadMoreIssues };
};
