import { Box, Avatar, Text, SegmentedControl, IconButton } from "@primer/react";
import { Blankslate, SkeletonAvatar, SkeletonText } from "@primer/react/drafts";
import { CopilotIcon, IssueOpenedIcon, KebabHorizontalIcon } from "@primer/octicons-react";
import ReactMarkdown from "react-markdown";
import { Issue } from "../../page";
import { useFetchAvatarUrl } from "../../hooks/useFetchAvatarUrl";
import styles from "./content.module.css";

interface ContentProps {
  issue: Issue;
  loading: boolean;
}

const EmptyState = () => {
  return (
    <Box className={styles.emptyState}>
      <Blankslate spacious>
        <Blankslate.Visual>
          <IssueOpenedIcon size="medium" />
        </Blankslate.Visual>
        <Blankslate.Heading>Select an issue</Blankslate.Heading>
        <Blankslate.Description>Select an issue in the sidebar to get started.</Blankslate.Description>
      </Blankslate>
    </Box>
  );
};

export const Content: React.FC<ContentProps> = ({ issue, loading }) => {
  const { avatarUrls, avatarLoading } = useFetchAvatarUrl(issue);

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
      {loading ? <SkeletonText lines={3} /> : <ReactMarkdown>{issue.body}</ReactMarkdown>}
    </Box>
  );

  const IssueContent = () => {
    return (
      <>
        <Box className={styles.issueToolbar}>
          <SegmentedControl aria-label="View">
            <SegmentedControl.Button defaultSelected>Original</SegmentedControl.Button>
            <SegmentedControl.Button leadingIcon={CopilotIcon}>Summary</SegmentedControl.Button>
          </SegmentedControl>
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

  return <Box className={styles.container}>{!loading && !issue ? <EmptyState /> : <IssueContent />}</Box>;
};
