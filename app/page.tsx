"use client";

import { ThemeProvider, BaseStyles, Box } from "@primer/react";
import { useState, useEffect } from "react";
import { AppHeader } from "./components/header/header";
import { Navigation } from "./components/navigation/navigation";
import { IssueContent } from "./components/issue/issueContent";
import Chat from "./components/chat/chat";
import { useIssues } from "./hooks/useIssues";
import styles from "./page.module.css";
import { RepoHeader } from "./components/repoHeader/repoHeader";
import { Endpoints } from "@octokit/types";
import { NewIssueForm } from "./components/newIssueForm/newIssueForm";
import { createIssue, fetchFileContent } from "./client";

export interface Repo {
  name: string;
  owner: string;
}

export type Issue = Endpoints["GET /repos/{owner}/{repo}/issues"]["response"]["data"][number];

const repos: Repo[] = [
  { name: "grid-playground", owner: "daviddossett" },
  { name: "swr", owner: "vercel" },
  { name: "vscode", owner: "microsoft" },
  { name: "react", owner: "primer" },
  { name: "vscode-codicons", owner: "microsoft" },
];

export default function Home() {
  const [selectedRepo, setSelectedRepo] = useState<Repo>(repos[0]);
  const [currentItem, setCurrentItem] = useState<number>(0);
  const [isCreatingIssue, setIsCreatingIssue] = useState<boolean>(false);
  const [tempIssue, setTempIssue] = useState<Issue | null>(null);
  const [issueTemplate, setIssueTemplate] = useState<string | null>(null);

  const { issues, loading, loadMoreIssues, hasMore } = useIssues(selectedRepo);

  useEffect(() => {
    if (issues.length > 0 && currentItem >= issues.length) {
      setCurrentItem(0);
    }
  }, [currentItem, issues]);

  useEffect(() => {
    const fetchIssueTemplate = async () => {
      try {
        const content = await fetchFileContent(selectedRepo, ".github/issue-template.md");
        setIssueTemplate(content);
      } catch (error) {
        console.error("Failed to fetch issue template:", error);
        setIssueTemplate(null);
      }
    };

    fetchIssueTemplate();
  }, [selectedRepo]);

  const handleRepoSelection = (repo: Repo) => {
    setSelectedRepo(repo);
    setCurrentItem(0);
    setIssueTemplate(null);
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

  const handleNewIssue = () => {
    const newTempIssue = {
      id: Date.now(),
      title: "New issue",
      body: "",
      user: { login: "current_user" },
      created_at: new Date().toISOString(),
    } as Issue;
    setTempIssue(newTempIssue);
    setIsCreatingIssue(true);
    setCurrentItem(0);
  };

  const handleCreateIssue = async (title: string, body: string) => {
    try {
      const newIssue = await createIssue(selectedRepo, title, body);
      issues.unshift(newIssue);
      setTempIssue(null);
      setIsCreatingIssue(false);
      setCurrentItem(0);
    } catch (error) {
      console.error("Failed to create issue:", error);
    }
  };

  const handleDiscardIssue = () => {
    setTempIssue(null);
    setIsCreatingIssue(false);
    setCurrentItem(0);
  };

  const isLastItem = currentItem === issues.length - 1;

  return (
    <ThemeProvider colorMode="auto" preventSSRMismatch>
      <BaseStyles>
        <Box className={styles.container}>
          <AppHeader />
          <RepoHeader
            repos={repos}
            selectedRepo={selectedRepo}
            onRepoSelected={handleRepoSelection}
            onNewIssue={handleNewIssue}
          />
          <Box className={styles.innerContainer}>
            <Box className={styles.mainContent}>
              <Navigation
                setCurrentItem={setCurrentItem}
                currentItem={currentItem}
                repo={selectedRepo.name}
                issues={tempIssue ? [tempIssue, ...issues] : issues}
                loading={loading}
                loadMoreIssues={loadMoreIssues}
                hasMore={hasMore}
              />
              {isCreatingIssue ? (
                <NewIssueForm
                  onCreate={handleCreateIssue}
                  onDiscard={handleDiscardIssue}
                  onTitleChange={(title: string) => setTempIssue((prev) => prev && { ...prev, title })}
                  onBodyChange={(body: string) => setTempIssue((prev) => prev && { ...prev, body })}
                />
              ) : (
                <IssueContent
                  issue={issues[currentItem]}
                  loading={loading}
                  currentItem={currentItem}
                  setCurrentItem={handleSetCurrentItem}
                  loadMoreIssues={loadMoreIssues}
                  hasMore={hasMore}
                  isLastItem={isLastItem}
                />
              )}
              <Chat issue={tempIssue || issues[currentItem]} loading={loading} issueTemplate={issueTemplate} />
            </Box>
          </Box>
        </Box>
      </BaseStyles>
    </ThemeProvider>
  );
}
