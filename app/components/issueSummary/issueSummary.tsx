import { Box, Details, useDetails, Button, Text } from "@primer/react";
import { SkeletonText } from "@primer/react/drafts";
import { CopilotIcon } from "@primer/octicons-react";
import { Issue } from "../../page";
import styles from "./issueSummary.module.css";

const IssueSummary = ({
  issue,
  summaryLoading,
  issueSummaries,
}: {
  issue: Issue;
  summaryLoading: boolean;
  issueSummaries: Record<number, string>;
}) => {
  const { getDetailsProps } = useDetails({
    closeOnOutsideClick: true,
  });

  return (
    <Details {...getDetailsProps()}>
      <Button leadingVisual={CopilotIcon} as="summary">
        Summarize with Copilot
      </Button>
      <Box className={styles.issueSummary}>
        {summaryLoading ? <SkeletonText lines={3} /> : <Text>{issueSummaries[issue.id]}</Text>}
      </Box>
    </Details>
  );
};

export default IssueSummary;
