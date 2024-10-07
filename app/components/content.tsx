import { useState, useEffect } from "react";
import { Box, Avatar, Text } from "@primer/react";
import { SkeletonAvatar, SkeletonText } from "@primer/react/drafts";
import ReactMarkdown from "react-markdown";
import { Issue } from "../page";
import { fetchIssueSummary, fetchAvatarUrl } from "../client";

export const Content = ({
  issue,
  loading,
}: {
  issue: Issue;
  loading: boolean;
}) => {
  const [avatarUrls, setAvatarUrls] = useState<{ [key: string]: string }>({});
  const [avatarLoading, setAvatarLoading] = useState<boolean>(true);
  const [issueSummaries, setIssueSummaries] = useState<{
    [key: string]: string;
  }>({});
  const [summaryLoading, setSummaryLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (issue?.user && !avatarUrls[issue.user.login]) {
        setAvatarLoading(true);
        try {
          const url = await fetchAvatarUrl(issue.user.login);
          if (issue?.user) {
            setAvatarUrls((prev) => ({
              ...prev,
              [issue?.user?.login ?? ""]: url,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch avatar URL:", error);
        } finally {
          setAvatarLoading(false);
        }
      } else {
        setAvatarLoading(false);
      }
    };

    fetchAvatar();
  }, [issue, avatarUrls]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (issue?.body && !issueSummaries[issue.id]) {
        setSummaryLoading(true);
        try {
          const summary = await fetchIssueSummary(issue.body);
          setIssueSummaries((prev) => ({ ...prev, [issue.id]: summary }));
        } catch (error) {
          console.error("Failed to fetch issue summary:", error);
        } finally {
          setSummaryLoading(false);
        }
      } else {
        setSummaryLoading(false);
      }
    };

    fetchSummary();
  }, [issue, issueSummaries]);

  if (!issue) return null;

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
            <Text as="p" sx={{ fontWeight: "bold", fontSize: 1, m: "0" }}>
              {issue?.user?.login ?? "Unknown"}
            </Text>
          </Box>
        </Box>

        {/* Main content */}
        <Box sx={{ p: "16px" }}>
          {loading || summaryLoading ? (
            <SkeletonText lines={6} />
          ) : (
            <ReactMarkdown>{issueSummaries[issue.id]}</ReactMarkdown>
          )}
        </Box>
      </Box>
    </Box>
  );
};
