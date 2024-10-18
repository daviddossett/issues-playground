import React, { useState } from "react";
import { Box, Text, Button, Label, Spinner } from "@primer/react";
import { Octicon } from "@primer/react";
import { CopilotIcon } from "@primer/octicons-react";
import styles from "./IssueSummary.module.css";
import { useFetchIssueSummary } from "@/app/hooks/useFetchIssueSummary";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Issue } from "../../page";

const IssueSummary: React.FC<{ issue: Issue }> = ({ issue }) => {
  const [showSummary, setShowSummary] = useState(false);
  const handleSummarizeClick = () => {
    setShowSummary(true);
  };

  const issueBodyLengthThreshold = 1400;

  // Ensures the summary doesn't show up for short issues
  if (!issue.body || issue.body.length < issueBodyLengthThreshold) {
    return null;
  }

  const IssueSummaryContent: React.FC<{ issue: Issue }> = ({ issue }) => {
    const { issueSummary, summaryLoading } = useFetchIssueSummary(issue);

    if (summaryLoading) {
      return <Spinner size={"small"} />;
    }

    return (
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className={"markdown-body"}>
        {issueSummary}
      </Markdown>
    );
  };

  return (
    <Box className={styles.issueSummary}>
      <Box className={styles.issueSummaryHeader}>
        <Box className={styles.issueSummaryHeaderLeft}>
          <Box className={styles.copilotIcon}>
            <Octicon icon={CopilotIcon} size={12} />
          </Box>
          <Text as="h3" className={styles.issueSummaryTitle}>
            Copilot
          </Text>
          <Text as="span" className={styles.issueSummaryDescription}>
            Summarize the issue with Copilot
          </Text>
          <Label>Preview</Label>
        </Box>
        <Button variant={"default"} onClick={handleSummarizeClick}>
          Summarize
        </Button>
      </Box>
      {showSummary && <IssueSummaryContent issue={issue} />}
    </Box>
  );
};

export default IssueSummary;
