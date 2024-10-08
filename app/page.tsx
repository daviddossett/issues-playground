"use client";

import { ThemeProvider, BaseStyles, Box } from "@primer/react";
import { useState, useEffect } from "react";
import { AppHeader } from "./components/header";
import { Navigation } from "./components/navigation";
import { Content } from "./components/content";
import { useIssues } from "./hooks/useIssues";

export interface Issue {
  id: number;
  title: string;
  body?: string | null;
  user: {
    login: string;
  } | null;
}

export default function Home() {
  const { repoTitle, issues, loading, loadMoreIssues } = useIssues();
  const [currentItem, setCurrentItem] = useState(0);

  useEffect(() => {
    if (issues.length > 0) {
      setCurrentItem(0);
    }
  }, [issues]);

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
              loadMoreIssues={loadMoreIssues}
            />
            <Content issue={issues[currentItem]} loading={loading} />
          </Box>
        </Box>
      </BaseStyles>
    </ThemeProvider>
  );
}
