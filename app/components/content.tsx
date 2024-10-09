import { Box, Avatar, Text } from "@primer/react";
import { SkeletonAvatar, SkeletonText } from "@primer/react/drafts";
import ReactMarkdown from "react-markdown";
import { Issue } from "../page";
import { useFetchAvatarUrl } from "../hooks/useFetchAvatarUrl";
import { useFetchIssueSummary } from "../hooks/useFetchIssueSummary";

export const Content = ({
  issue,
  loading,
}: {
  issue: Issue;
  loading: boolean;
}) => {
  const { avatarUrls, avatarLoading } = useFetchAvatarUrl(issue);
  const { issueSummaries, summaryLoading } = useFetchIssueSummary(issue);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflowY: "auto",
        alignItems: "center",
      }}
    >
      <Box sx={{ maxWidth: "800px", width: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            p: "16px 0",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            borderBottom: "1px solid",
            borderColor: "border.default",
            width: "100%",
          }}
        >
          {loading ? (
            <SkeletonText size={"titleMedium"} />
          ) : (
            <Text
              as="h2"
              sx={{ fontWeight: "normal", fontSize: "32px", mb: "0" }}
            >
              {issue.title}
            </Text>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "8px",
              width: "100%",
            }}
          >
            {avatarLoading ? (
              <SkeletonAvatar size={20} square={false} />
            ) : (
              <Avatar src={avatarUrls[issue?.user?.login ?? ""]} />
            )}
            {loading ? (
              <SkeletonText size={"bodySmall"} maxWidth={150} />
            ) : (
              <Text as="p" sx={{ fontWeight: "bold", fontSize: 1, m: "0" }}>
                {issue?.user?.login ?? "Unknown"}
              </Text>
            )}
          </Box>
        </Box>

        {/* Main content */}
        <Box sx={{ py: "16px" }}>
          {loading || summaryLoading ? (
            <SkeletonText lines={4} />
          ) : (
            <ReactMarkdown>{issueSummaries[issue.id]}</ReactMarkdown>
          )}
        </Box>
      </Box>
    </Box>
  );
};
