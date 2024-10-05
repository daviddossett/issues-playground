"use client";

import {
  ThemeProvider,
  BaseStyles,
  Box,
  NavList,
  Text,
  Avatar,
  Spinner,
} from "@primer/react";
import { SkeletonAvatar } from "@primer/react/drafts"; // Ensure SkeletonAvatar is imported
import { useState, useEffect } from "react";
import {
  fetchIssues,
  fetchRepoDetails,
  getIssueSummary,
  getUserAvatarUrl,
} from "./api";
import { AppHeader } from "./header";
import ReactMarkdown from "react-markdown";

interface Issue {
  id: number;
  title: string;
  body?: string | null | undefined;
  user: {
    login: string;
  } | null;
}

const Navigation = ({
  setCurrentItem,
  issues,
  repoTitle,
}: {
  setCurrentItem: (index: number) => void;
  issues: Issue[];
  repoTitle: string | undefined;
}) => {
  const [currentItem, setCurrentItemState] = useState(0);
  const [summaries, setSummaries] = useState<string[]>([]);

  useEffect(() => {
    const fetchSummaries = async () => {
      const summaries = await Promise.all(
        issues.map(async (issue) => {
          const summary = await getIssueSummary(issue.body ?? "");
          return summary;
        })
      );
      setSummaries(summaries);
    };

    fetchSummaries();
  }, [issues]);

  const handleItemClick = (index: number) => {
    setCurrentItemState(index);
    setCurrentItem(index);
  };

  const navItems = issues.map((issue, index) => (
    <NavList.Item
      key={issue.id}
      aria-current={index === currentItem ? "page" : undefined}
      onClick={() => handleItemClick(index)}
    >
      {summaries[index] || "Loading..."}
    </NavList.Item>
  ));

  return (
    <Box
      sx={{
        maxWidth: "320px",
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: "320px",
        borderRight: "1px solid",
        borderColor: "border.default",
        paddingX: 2,
        overflowY: "auto",
        height: "100%",
      }}
    >
      <NavList.Group title={repoTitle}>
        <NavList>{navItems}</NavList>
      </NavList.Group>
    </Box>
  );
};

const Content = ({ issue }: { issue: Issue | undefined }) => {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarLoading, setAvatarLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      if (issue?.user) {
        setAvatarLoading(true); // Reset loading state
        const url = await getUserAvatarUrl(issue.user.login);
        setAvatarUrl(url);
        setAvatarLoading(false);
      }
    };

    fetchAvatarUrl();
  }, [issue]);

  if (!issue) return null;

  return (
    <Box sx={{ maxWidth: "800px", width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          p: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          borderBottom: "1px solid",
          borderColor: "border.default",
          width: "100%",
        }}
      >
        <Text as="h2" sx={{ fontWeight: "normal", fontSize: "32px" }}>
          {issue.title}
        </Text>
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
            <Avatar src={avatarUrl} />
          )}
          <Text as="p" sx={{ fontWeight: "bold", fontSize: 1 }}>
            {issue.user ? issue.user.login : "Unknown"}
          </Text>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ p: "16px" }}>
        <ReactMarkdown>{issue.body ? issue.body : ""}</ReactMarkdown>
      </Box>
    </Box>
  );
};

const ContentArea = ({
  currentItem,
  issues,
}: {
  currentItem: number;
  issues: Issue[];
}) => {
  const selectedIssue = issues[currentItem];

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
      <Content issue={selectedIssue} />
    </Box>
  );
};

export default function Home() {
  const [currentItem, setCurrentItem] = useState(0);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [repoTitle, setRepoTitle] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getIssues = async () => {
      const data: Issue[] = await fetchIssues();
      setIssues(data);
    };

    const getRepoDetails = async () => {
      const data = await fetchRepoDetails();
      setRepoTitle(data.name);
    };

    const fetchData = async () => {
      await getIssues();
      await getRepoDetails();
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <ThemeProvider colorMode="night">
        <BaseStyles>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              width: "100vw",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner size="medium" />
          </Box>
        </BaseStyles>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider colorMode="night">
      <BaseStyles>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
          }}
        >
          <AppHeader />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              maxWidth: "100%",
              flexGrow: 1,
              overflow: "hidden",
            }}
          >
            <Navigation
              setCurrentItem={setCurrentItem}
              issues={issues}
              repoTitle={repoTitle}
            />
            <ContentArea currentItem={currentItem} issues={issues} />
          </Box>
        </Box>
      </BaseStyles>
    </ThemeProvider>
  );
}
