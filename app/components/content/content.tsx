import { Box, Avatar, Text, ActionBar } from "@primer/react";
import { SkeletonAvatar, SkeletonText } from "@primer/react/drafts";
import { CopilotIcon, KebabHorizontalIcon, PencilIcon } from "@primer/octicons-react";
import ReactMarkdown from "react-markdown";
import { Issue } from "../../page";
import { useFetchAvatarUrl } from "../../hooks/useFetchAvatarUrl";
import styles from "./content.module.css";

interface ContentProps {
  issue: Issue;
  loading: boolean;
}

export const Content: React.FC<ContentProps> = ({ issue, loading }) => {
  const { avatarUrls, avatarLoading } = useFetchAvatarUrl(issue);
  // const { issueSummaries, summaryLoading } = useFetchIssueSummary(issue);

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

  const IssueHeaderToolbar = () => (
    <ActionBar aria-label="Toolbar">
      <ActionBar.IconButton icon={CopilotIcon} aria-label="Summarize with Copilot" />
      <ActionBar.IconButton icon={PencilIcon} aria-label="Edit" />
      <ActionBar.IconButton icon={KebabHorizontalIcon} aria-label="More" />
    </ActionBar>
  );

  const IssueBody = () => (
    <Box className={styles.issueBody}>
      {loading ? <SkeletonText lines={4} /> : <ReactMarkdown>{issue.body}</ReactMarkdown>}
    </Box>
  );

  return (
    <Box className={styles.container}>
      <Box className={styles.innerContainer}>
        <Box className={styles.issueHeader}>
          <IssueTitle />
          <Box className={styles.issueHeaderToolbar}>
            <IssueAuthor />
            <IssueHeaderToolbar />
          </Box>
        </Box>
        <Box className={styles.mainContent}>
          <IssueBody />
        </Box>
      </Box>
    </Box>
  );
};
