import { useState, useEffect } from "react";
import { fetchIssueSummary } from "../client";
import { Issue } from "../page";

export const useFetchIssueSummary = (issue: Issue) => {
  const [issueSummaries, setIssueSummaries] = useState<{ [key: string]: string }>({});
  const [summaryLoading, setSummaryLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSummary = async () => {
      if (issue?.body && !issueSummaries[issue.id]) {
        setSummaryLoading(true);
        try {
          const summary = await fetchIssueSummary(issue.body);
          setIssueSummaries((prev) => ({ ...prev, [issue.id]: summary }));
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
  }, [issue, issueSummaries]);

  return { issueSummaries, summaryLoading };
};
