import { Box, Text } from "@primer/react";
import { SkeletonText } from "@primer/react/drafts";
import { Issue } from "../../page";
import styles from "./issueSummary.module.css";
import { useFetchIssueSummary } from "@/app/hooks/useFetchIssueSummary";

const IssueSummary = ({ issue }: { issue: Issue; summaryLoading: boolean; issueSummaries: Record<number, string> }) => {
  const { issueSummaries, summaryLoading } = useFetchIssueSummary(issue);

  return (
    <Box className={styles.issueSummary}>
      {summaryLoading ? <SkeletonText lines={3} /> : <Text>{issueSummaries[issue.id]}</Text>}
    </Box>
  );
};

export default IssueSummary;
