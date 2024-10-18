"use client";

import { ThemeProvider, BaseStyles, Box } from "@primer/react";
import { useState } from "react";
import { AppHeader } from "./components/header/header";
import { Navigation } from "./components/navigation/navigation";
import { Content } from "./components/content/content";
import { useIssues } from "./hooks/useIssues";
import styles from "./page.module.css";
import { RepoHeader } from "./components/repoHeader/repoHeader";
import { Blankslate } from "@primer/react/drafts";
import { IssueOpenedIcon } from "@primer/octicons-react";

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

const repos: Repo[] = [{ name: "grid-playground", owner: "daviddossett" }];

const EmptyState = () => {
  return (
    <Box className={styles.emptyState}>
      <Blankslate spacious>
        <Blankslate.Visual>
          <IssueOpenedIcon size="medium" />
        </Blankslate.Visual>
        <Blankslate.Heading>No issues</Blankslate.Heading>
        <Blankslate.Description>Create an issue to report an issue or share an idea</Blankslate.Description>
        <Blankslate.PrimaryAction href="#">New issue</Blankslate.PrimaryAction>
      </Blankslate>
    </Box>
  );
};

export default function Home() {
  const [selectedRepo, setSelectedRepo] = useState(repos[0]);
  const { issues, loading, loadMoreIssues, hasMore } = useIssues(selectedRepo);
  const [currentItem, setCurrentItem] = useState(0);

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
              {issues.length === 0 && !loading ? (
                <EmptyState /> // Render EmptyState when there are no issues
              ) : (
                <>
                  <Navigation
                    setCurrentItem={setCurrentItem}
                    issues={issues}
                    loading={loading}
                    loadMoreIssues={loadMoreIssues}
                    hasMore={hasMore}
                  />
                  <Content issue={issues[currentItem]} loading={loading} />
                </>
              )}
            </Box>
          </Box>
        </Box>
      </BaseStyles>
    </ThemeProvider>
  );
}
