"use client";

import {
  ThemeProvider,
  BaseStyles,
  Box,
  NavList,
  Text,
  Avatar,
} from "@primer/react";
import { useState, useEffect } from "react";
import { fetchIssues, fetchRepoDetails, getUserAvatarUrl } from "./api";
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
      {issue.title}
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

  useEffect(() => {
    const fetchAvatar = async () => {
      if (issue && issue.user) {
        const url = await getUserAvatarUrl(issue.user.login);
        setAvatarUrl(url);
      }
    };

    fetchAvatar();
  }, [issue]);

  if (!issue) return null;

  return (
    <Box>
      <Box
        sx={{
          p: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          borderBottom: "1px solid",
          borderColor: "border.default",
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
          }}
        >
          <Avatar src={avatarUrl} />
          <Text as="p" sx={{ fontWeight: "bold", fontSize: 1 }}>
            {issue.user ? issue.user.login : "Unknown"}
          </Text>
        </Box>
      </Box>
      <ReactMarkdown>{issue.body ? issue.body : ""}</ReactMarkdown>
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
        flexGrow: 1,
        overflowY: "auto",
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

  useEffect(() => {
    const getIssues = async () => {
      const data: Issue[] = await fetchIssues();
      setIssues(data);
    };

    const getRepoDetails = async () => {
      const data = await fetchRepoDetails();
      setRepoTitle(data.name);
    };

    getIssues();
    getRepoDetails();
  }, []);

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
