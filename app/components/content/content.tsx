import { Box, Avatar, Text } from "@primer/react";
import { SkeletonAvatar, SkeletonText } from "@primer/react/drafts";
import ReactMarkdown from "react-markdown";
import { Issue } from "../../page";
import { useFetchAvatarUrl } from "../../hooks/useFetchAvatarUrl";
import styles from "./content.module.css";

export const Content = ({ issue, loading }: { issue: Issue; loading: boolean }) => {
  const { avatarUrls, avatarLoading } = useFetchAvatarUrl(issue);
  // const { issueSummaries, summaryLoading } = useFetchIssueSummary(issue);

  if (!issue) {
    return null;
  }
  const formattedDate = new Date(issue.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box className={styles.container}>
      <Box className={styles.innerContainer}>
        <Box className={styles.issueHeader}>
          {loading || !issue?.user ? (
            <>
              <SkeletonText size={"titleMedium"} />
              <Box className={styles.issueMeta}>
                <SkeletonAvatar size={20} square={false} />
                <SkeletonText size={"bodySmall"} maxWidth={150} />
              </Box>
            </>
          ) : (
            <>
              <Text as="h2" className={styles.issueTitle}>
                {issue.title}
              </Text>
              <Box className={styles.issueMeta}>
                {avatarLoading ? (
                  <SkeletonAvatar size={20} square={false} />
                ) : (
                  <Avatar src={avatarUrls[issue.user.login]} />
                )}
                <Text as="p" className={styles.issueUser}>
                  {issue?.user?.login ?? "Unknown"}
                </Text>
                <Text as="span" className={styles.issueCreatedAt}>
                  opened on {formattedDate}
                </Text>
              </Box>
            </>
          )}
        </Box>

        <Box className={styles.mainContent}>
          {loading ? <SkeletonText lines={4} /> : <ReactMarkdown>{issue.body}</ReactMarkdown>}
        </Box>
      </Box>
    </Box>
  );
};
