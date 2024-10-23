import { Box, Avatar, Text, IconButton } from "@primer/react";
import { SkeletonText, SkeletonAvatar } from "@primer/react/drafts";
import { ArrowDownIcon, ArrowUpIcon, KebabHorizontalIcon } from "@primer/octicons-react";
import { Issue } from "../../page";
import { useFetchAvatarUrl } from "../../hooks/useFetchAvatarUrl";
import styles from "./issueContent.module.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import IssueSummary from "../issueSummary/issueSummary";

interface ContentProps {
  issue: Issue;
  loading: boolean;
  currentItem: number;
  setCurrentItem: (change: number) => void;
  loadMoreIssues: () => void;
  hasMore: boolean;
  isLastItem: boolean;
}

export const IssueContent: React.FC<ContentProps> = ({
  issue,
  loading,
  currentItem,
  setCurrentItem,
  hasMore,
  isLastItem,
}) => {
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

  const handlePreviousClick = () => {
    setCurrentItem(-1);
  };

  const handleNextClick = () => {
    setCurrentItem(1);
  };

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
          <Box className={styles.issueNavigationArrows}>
            <IconButton
              icon={ArrowUpIcon}
              aria-label="Previous"
              onClick={handlePreviousClick}
              disabled={currentItem === 0}
            />
            <IconButton
              icon={ArrowDownIcon}
              aria-label="Next"
              onClick={handleNextClick}
              disabled={isLastItem && !hasMore}
            />
          </Box>
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
