"use client";

import { ThemeProvider, BaseStyles, Box } from "@primer/react";
import { useState, useEffect } from "react";
import { AppHeader } from "./components/header/header";
import { Navigation } from "./components/navigation/navigation";
import { Content } from "./components/content/content";
import { useIssues } from "./hooks/useIssues";
import styles from "./page.module.css";
import { RepoHeader } from "./components/repoHeader/repoHeader";
import { Endpoints } from "@octokit/types"; // Import Endpoints from Octokit

export interface Repo {
  name: string;
  owner: string;
}

export type Issue = Endpoints["GET /repos/{owner}/{repo}/issues"]["response"]["data"][number];

const repos: Repo[] = [
  { name: "react", owner: "primer" },
  { name: "vscode", owner: "microsoft" },
  { name: "vscode-codicons", owner: "microsoft" },
  { name: "grid-playground", owner: "daviddossett" },
];

export default function Home() {
  const [selectedRepo, setSelectedRepo] = useState(repos[0]);
  const { issues, loading, loadMoreIssues, hasMore } = useIssues(selectedRepo);
  const [currentItem, setCurrentItem] = useState(0);

  useEffect(() => {
    if (issues.length > 0 && currentItem >= issues.length) {
      setCurrentItem(0);
    }
  }, [currentItem, issues]);

  const handleRepoSelection = (repo: Repo) => {
    setSelectedRepo(repo);
  };

  const handleSetCurrentItem = async (change: number) => {
    const newIndex = currentItem + change;
    if (newIndex >= issues.length) {
      if (hasMore) {
        const previousIssuesLength = issues.length;
        await loadMoreIssues();
        setCurrentItem(previousIssuesLength);
      } else {
        setCurrentItem(issues.length - 1);
      }
    } else if (newIndex < 0) {
      setCurrentItem(0);
    } else {
      setCurrentItem(newIndex);
    }
  };

  const isLastItem = currentItem === issues.length - 1;

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
                currentItem={currentItem}
                repo={selectedRepo.name}
                issues={issues}
                loading={loading}
                loadMoreIssues={loadMoreIssues}
                hasMore={hasMore}
              />
              <Content
                issue={issues[currentItem]}
                loading={loading}
                currentItem={currentItem}
                setCurrentItem={handleSetCurrentItem}
                loadMoreIssues={loadMoreIssues}
                hasMore={hasMore}
                isLastItem={isLastItem}
              />
            </Box>
          </Box>
        </Box>
      </BaseStyles>
    </ThemeProvider>
  );
}
