"use client";

import { ThemeProvider, BaseStyles, Box, Spinner } from "@primer/react";
import { useState, useEffect } from "react";
import { fetchIssues, fetchRepoDetails } from "./api/github";
import { AppHeader } from "./components/header";
import { Navigation } from "./components/navigation";
import { ContentArea } from "./components/content";

export interface Issue {
  id: number;
  title: string;
  body?: string | null | undefined;
  user: {
    login: string;
  } | null;
}

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
