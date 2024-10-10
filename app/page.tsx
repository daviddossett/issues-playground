"use client";

import { ThemeProvider, BaseStyles, Box } from "@primer/react";
import { useState, useEffect } from "react";
import { AppHeader } from "./components/header/header";
import { Navigation } from "./components/navigation/navigation";
import { Content } from "./components/content/content";
import { useIssues } from "./hooks/useIssues";
import styles from "./page.module.css";

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
        <Box className={styles.container}>
          <AppHeader repoTitle={repoTitle} loading={loading} />
          <Box className={styles.innerContainer}>
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
