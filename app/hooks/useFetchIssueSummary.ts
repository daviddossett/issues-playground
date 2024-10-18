import { useState, useEffect } from "react";
import { fetchIssueSummary } from "../client";
import { Issue } from "../page";

export const useFetchIssueSummary = (issue: Issue) => {
  const [issueSummary, setIssueSummary] = useState<string>("");
  const [summaryLoading, setSummaryLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSummary = async () => {
      if (issue?.body) {
        setSummaryLoading(true);
        try {
          const summary = await fetchIssueSummary(issue.body);
          setIssueSummary(summary);
        } catch (error) {
          console.error("Failed to fetch issue summary:", error);
        } finally {
          setSummaryLoading(false);
        }
      } else {
        setSummaryLoading(false);
      }
    };

    fetchSummary();
  }, [issue]);

  return { issueSummary, summaryLoading };
};
