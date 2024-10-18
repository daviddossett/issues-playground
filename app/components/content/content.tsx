import { Box, Avatar, Text, IconButton, Octicon, Label, Spinner, Button } from "@primer/react";
import { SkeletonAvatar, SkeletonText } from "@primer/react/drafts";
import { CopilotIcon, KebabHorizontalIcon } from "@primer/octicons-react";
import { Issue } from "../../page";
import { useFetchAvatarUrl } from "../../hooks/useFetchAvatarUrl";
import styles from "./content.module.css";
import { useState } from "react";
import { useFetchIssueSummary } from "@/app/hooks/useFetchIssueSummary";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "./github-markdown.css";

interface ContentProps {
  issue: Issue;
  loading: boolean;
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

const IssueSummary: React.FC<{ issue: Issue }> = ({ issue }) => {
  const [showSummary, setShowSummary] = useState(false);
  const handleSummarizeClick = () => {
    setShowSummary(true);
  };

  const issueBodyLengthThreshold = 1400;
  console.log(issue?.body?.length);

  if (!issue.body || issue.body.length < issueBodyLengthThreshold) {
    return null; // Do not render the summary component if the issue body is too short
  }

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

export const Content: React.FC<ContentProps> = ({ issue, loading }) => {
  const { avatarUrls, avatarLoading } = useFetchAvatarUrl(issue);

  if (!loading && !issue) {
    return null;
  }

  const formattedDate = issue?.created_at
    ? new Date(issue.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  const IssueAuthor = () => {
    if (loading || !issue?.user) {
      return (
        <>
          <Box className={styles.issueMeta}>
            <SkeletonAvatar size={20} square={false} />
            <SkeletonText size={"bodySmall"} maxWidth={150} />
          </Box>
        </>
      );
    }

    return (
      <>
        <Box className={styles.issueMeta}>
          {avatarLoading ? <SkeletonAvatar size={20} square={false} /> : <Avatar src={avatarUrls[issue.user.login]} />}
          <Text as="p" className={styles.issueUser}>
            {issue.user.login}
          </Text>
          <Text as="span" className={styles.issueCreatedAt}>
            opened on {formattedDate}
          </Text>
        </Box>
      </>
    );
  };

  const IssueTitle = () => (
    <Text as="h2" className={styles.issueTitle}>
      {loading ? <SkeletonText size={"titleMedium"} /> : issue.title}
    </Text>
  );

  const IssueBody = () => (
    <Box className={styles.issueBody}>
      {loading ? (
        <SkeletonText lines={3} />
      ) : (
        <>
          <IssueSummary issue={issue} />
          <Markdown className={"markdown-body"} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {issue.body}
          </Markdown>
        </>
      )}
    </Box>
  );

  const IssueContent = () => {
    return (
      <>
        <Box className={styles.issueToolbar}>
          <IconButton icon={KebabHorizontalIcon} aria-label="More" />
        </Box>
        <Box className={styles.innerContainer}>
          <Box className={styles.issueHeader}>
            <IssueTitle />
            <IssueAuthor />
          </Box>
          <Box className={styles.mainContent}>
            <IssueBody />
          </Box>
        </Box>
      </>
    );
  };

  return (
    <Box className={styles.container}>
      <IssueContent />
    </Box>
  );
};
