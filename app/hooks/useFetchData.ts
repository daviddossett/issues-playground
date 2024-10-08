import { useState, useEffect } from "react";
import { fetchRepoDetails, fetchIssues } from "../client";
import { Issue } from "../page";

export const useFetchData = () => {
    const [repoTitle, setRepoTitle] = useState<string>();
    const [initialIssues, setInitialIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [repoName, issuesData] = await Promise.all([
                    fetchRepoDetails(),
                    fetchIssues(1),
                ]);
                setRepoTitle(repoName);
                setInitialIssues(issuesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { repoTitle, initialIssues, loading };
};
