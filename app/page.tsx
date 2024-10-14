"use client";

import { ThemeProvider, BaseStyles, Box } from "@primer/react";
import { useState } from "react";
import { AppHeader } from "./components/header/header";
import { Navigation } from "./components/navigation/navigation";
import { Content } from "./components/content/content";
import { useIssues } from "./hooks/useIssues";
import styles from "./page.module.css";
import { RepoHeader } from "./components/repoHeader/repoHeader";

export interface Repo {
  name: string;
  owner: string;
}

export interface Issue {
  id: number;
  title: string;
  body?: string | null;
  user: {
    login: string;
  } | null;
  created_at: string;
}

const repos: Repo[] = [
  { name: "react", owner: "primer" },
  { name: "octicons", owner: "primer" },
  { name: "primitives", owner: "primer" },
  { name: "vscode", owner: "microsoft" },
  { name: "grid-playground", owner: "daviddossett" },
];

export default function Home() {
  const [selectedRepo, setSelectedRepo] = useState(repos[0]);
  const { issues, loading, loadMoreIssues } = useIssues(selectedRepo);
  const [currentItem, setCurrentItem] = useState(0);

  console.log();

  const handleRepoSelection = (repo: Repo) => {
    setSelectedRepo(repo);
  };

  return (
    <ThemeProvider colorMode="auto" preventSSRMismatch>
      <BaseStyles>
        <Box className={styles.container}>
          <AppHeader />
          <RepoHeader repos={repos} selectedRepo={selectedRepo} onRepoSelected={handleRepoSelection} />
          <Box className={styles.innerContainer}>
            <Box className={styles.mainContent}>
              <Navigation
                setCurrentItem={setCurrentItem}
                issues={issues}
                loading={loading}
                loadMoreIssues={loadMoreIssues}
              />
              <Content issue={issues[currentItem]} loading={loading} />
            </Box>
          </Box>
        </Box>
      </BaseStyles>
    </ThemeProvider>
  );
}
