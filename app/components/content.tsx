import { Box, Avatar, Text, Details, useDetails, Button } from "@primer/react";
import { CopilotIcon } from "@primer/octicons-react";
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

  const { getDetailsProps } = useDetails({
    closeOnOutsideClick: true,
  });

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
        {/* Issue title & avatar */}
        <Box
          sx={{
            p: "16px 0",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            borderBottom: "1px solid",
            borderColor: "border.default",
            width: "100%",
            mb: "24px",
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
            {loading || avatarLoading || !issue?.user?.login ? (
              <SkeletonAvatar size={20} square={false} />
            ) : (
              <Avatar src={avatarUrls[issue.user.login]} />
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
        {summaryLoading || loading ? (
          <SkeletonText lines={1} />
        ) : (
          <Details {...getDetailsProps()}>
            <Button leadingVisual={CopilotIcon} as="summary">
              Summarize with Copilot
            </Button>
            <Box
              sx={{
                mt: "16px",
                p: "16px",
                border: "1px solid",
                borderColor: "border.default",
                borderRadius: "8px",
                backgroundColor: "canvas.subtle",
              }}
            >
              {summaryLoading ? (
                <SkeletonText lines={3} />
              ) : (
                <Text>{issueSummaries[issue.id]}</Text>
              )}
            </Box>
          </Details>
        )}

        <Box sx={{ py: "16px" }}>
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
