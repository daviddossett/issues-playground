"use client";

import { ThemeProvider, BaseStyles, Box } from "@primer/react";
import { useState, useEffect } from "react";
import { AppHeader } from "./components/header";
import { Navigation } from "./components/navigation";
import { Content } from "./components/content";
import { fetchRepoDetails, fetchIssues } from "./client";

export interface Issue {
  id: number;
  title: string;
  body?: string | null;
  user: {
    login: string;
  } | null;
}

export default function Home() {
  const [repoTitle, setRepoTitle] = useState<string>();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [currentItem, setCurrentItem] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repoName, issuesData] = await Promise.all([
          fetchRepoDetails(),
          fetchIssues(),
        ]);
        setRepoTitle(repoName);
        setIssues(issuesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider colorMode="auto" preventSSRMismatch>
      <BaseStyles>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
            backgroundColor: "canvas.default",
            color: "fg.default",
          }}
        >
          <AppHeader repoTitle={repoTitle ? repoTitle : ""} />
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
              loading={loading}
            />
            <Content issue={issues[currentItem]} loading={loading} />
          </Box>
        </Box>
      </BaseStyles>
    </ThemeProvider>
  );
}
