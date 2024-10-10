import { Box, Avatar, Text, Details, useDetails, Button } from "@primer/react";
import { CopilotIcon } from "@primer/octicons-react";
import { SkeletonAvatar, SkeletonText } from "@primer/react/drafts";
import ReactMarkdown from "react-markdown";
import { Issue } from "../../page";
import { useFetchAvatarUrl } from "../../hooks/useFetchAvatarUrl";
import { useFetchIssueSummary } from "../../hooks/useFetchIssueSummary";
import styles from "./content.module.css";

export const Content = ({
  issue,
  loading,
}: {
  issue: Issue;
  loading: boolean;
}) => {
  const { avatarUrls, avatarLoading } = useFetchAvatarUrl(issue);
  const { issueSummaries, summaryLoading } = useFetchIssueSummary(issue);

  const formattedDate = new Date(issue.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const { getDetailsProps } = useDetails({
    closeOnOutsideClick: true,
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

        {/* Main content */}
        {summaryLoading || loading ? (
          <SkeletonText lines={1} />
        ) : (
          <Details {...getDetailsProps()}>
            <Button leadingVisual={CopilotIcon} as="summary">
              Summarize with Copilot
            </Button>
            <Box className={styles.issueSummary}>
              {summaryLoading ? (
                <SkeletonText lines={3} />
              ) : (
                <Text>{issueSummaries[issue.id]}</Text>
              )}
            </Box>
          </Details>
        )}

        <Box className={styles.mainContent}>
          {loading ? (
            <SkeletonText lines={4} />
          ) : (
            <ReactMarkdown>{issue.body}</ReactMarkdown>
          )}
        </Box>
      </Box>
    </Box>
  );
};
