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
import { useImproveIssue } from "./hooks/useImproveIssue";
import { ImprovementsList } from "./components/improvementsList/improvementsList";

export type Issue = Endpoints["GET /repos/{owner}/{repo}/issues"]["response"]["data"][number];

export interface Repo {
  name: string;
  owner: string;
}

const repos: Repo[] = [
  { name: "grid-playground", owner: "daviddossett" },
  { name: "swr", owner: "vercel" },
  { name: "vscode", owner: "microsoft" },
  { name: "react", owner: "primer" },
  { name: "vscode-codicons", owner: "microsoft" },
];

export default function Home() {
  const [selectedRepo, setSelectedRepo] = useState<Repo>(repos[0]);
  const [currentIssue, setCurrentIssue] = useState<number>(0);
  const [isCreatingIssue, setIsCreatingIssue] = useState<boolean>(false);
  const [tempIssue, setTempIssue] = useState<Issue | null>(null);
  const [issueTemplate, setIssueTemplate] = useState<string | null>(null);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(true);
  const [isNavVisible, setIsNavVisible] = useState<boolean>(true);
  const [focusedImprovementIndex, setFocusedImprovementIndex] = useState<number | null>(0);
  const [isImprovementsVisible, setIsImprovementsVisible] = useState<boolean>(false);

  const { issues, loading, loadMoreIssues, hasMore } = useIssues(selectedRepo);
  const { improvements, setImprovements, fetchIssueImprovements } = useImproveIssue(
    tempIssue?.body || "",
    issueTemplate
  );

  useEffect(() => {
    if (issues.length > 0 && currentIssue >= issues.length) {
      setCurrentIssue(0);
    }
  }, [currentIssue, issues]);

  useEffect(() => {
    const fetchIssueTemplate = async () => {
      try {
        const content = await fetchFileContent(selectedRepo, ".github/issue-guidelines.md");
        setIssueTemplate(content);
      } catch (error) {
        console.error("Failed to fetch issue template:", error);
        setIssueTemplate(null);
      }
    };

    fetchIssueTemplate();
  }, [selectedRepo]);

  useEffect(() => {
    if (improvements?.length) {
      setIsImprovementsVisible(true);
    }
  }, [improvements]);

  const handleRepoSelection = (repo: Repo) => {
    setSelectedRepo(repo);
    setCurrentIssue(0);
    setIssueTemplate(null);
  };

  const handlesetCurrentIssue = async (change: number) => {
    const newIndex = currentIssue + change;
    if (newIndex >= issues.length) {
      if (hasMore) {
        const previousIssuesLength = issues.length;
        await loadMoreIssues();
        setCurrentIssue(previousIssuesLength);
      } else {
        setCurrentIssue(issues.length - 1);
      }
    } else if (newIndex < 0) {
      setCurrentIssue(0);
    } else {
      setCurrentIssue(newIndex);
    }
  };

  const handleNewIssue = () => {
    const sampleBody = `THIS THING IS ALWAYS BROKEN 😡 It's almost as if you're trying to create a terrible app. It never generates the right grid layouts AND EVEN IF IT DID the css it spits out just overflows off the page, so I can't see it. Do better, guys.`;

    const newTempIssue = {
      id: Date.now(),
      title: "New issue",
      body: sampleBody,
      user: { login: "current_user" },
      created_at: new Date().toISOString(),
    } as Issue;
    setTempIssue(newTempIssue);
    setIsCreatingIssue(true);
    setCurrentIssue(0);
    setIsChatVisible(false);
    setIsNavVisible(false);
  };

  const handleCreateIssue = async (title: string, body: string) => {
    try {
      const newIssue = await createIssue(selectedRepo, title, body);
      issues.unshift(newIssue);
      setTempIssue(null);
      setIsCreatingIssue(false);
      setCurrentIssue(0);
    } catch (error) {
      console.error("Failed to create issue:", error);
    }
  };

  const handleDiscardIssue = () => {
    setTempIssue(null);
    setIsCreatingIssue(false);
    setCurrentIssue(0);
    setIsChatVisible(true);
    setIsNavVisible(true);
  };

  const toggleNavVisibility = () => {
    setIsNavVisible(!isNavVisible);
  };

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  const handleImprovementClick = (index: number) => {
    setFocusedImprovementIndex(index);
  };

  const handleAcceptImprovement = (index: number) => {
    if (!improvements || !tempIssue?.body) return;

    const improvement = improvements[index];
    const updatedBody = tempIssue.body.replace(improvement.original, improvement.proposed);
    setTempIssue((prev) => prev && { ...prev, body: updatedBody });
    setImprovements((prevImprovements) => prevImprovements?.filter((_, i) => i !== index) || []);

    if (improvements.length === 1) {
      setIsImprovementsVisible(false);
    } else {
      setFocusedImprovementIndex(0);
    }
  };

  const handleDiscardImprovement = (index: number) => {
    if (!improvements) return;

    const updatedImprovements = improvements.filter((_, i) => i !== index);
    setImprovements(updatedImprovements);

    if (updatedImprovements.length === 0) {
      setIsImprovementsVisible(false);
    } else {
      setFocusedImprovementIndex(0);
    }
  };

  const handleFetchImprovements = () => {
    fetchIssueImprovements();
  };

  const isLastItem = currentIssue === issues.length - 1;

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
              {isNavVisible && (
                <Navigation
                  onSetCurrentIssue={setCurrentIssue}
                  currentIssue={currentIssue}
                  repo={selectedRepo.name}
                  issues={tempIssue ? [tempIssue, ...issues] : issues}
                  loading={loading}
                  loadMoreIssues={loadMoreIssues}
                  hasMore={hasMore}
                  toggleNavVisibility={toggleNavVisibility}
                />
              )}
              {isCreatingIssue ? (
                <NewIssueForm
                  onCreate={handleCreateIssue}
                  onDiscard={handleDiscardIssue}
                  onTitleChange={(title: string) => setTempIssue((prev) => prev && { ...prev, title })}
                  onBodyChange={(body: string) => setTempIssue((prev) => prev && { ...prev, body })}
                  toggleNavVisibility={toggleNavVisibility}
                  toggleChatVisibility={toggleChatVisibility}
                  isNavVisible={isNavVisible}
                  isChatVisible={isChatVisible}
                  onFetchImprovements={handleFetchImprovements}
                  improvements={improvements}
                  focusedImprovementIndex={focusedImprovementIndex}
                  handleImprovementClick={handleImprovementClick}
                  tempBody={tempIssue?.body || ""}
                />
              ) : (
                <IssueContent
                  issue={issues[currentIssue]}
                  loading={loading}
                  currentIssue={currentIssue}
                  onSetCurrentIssue={handlesetCurrentIssue}
                  loadMoreIssues={loadMoreIssues}
                  hasMore={hasMore}
                  isLastItem={isLastItem}
                  isNavVisible={isNavVisible}
                  toggleNavVisibility={toggleNavVisibility}
                  isChatVisible={isChatVisible}
                  toggleChatVisibility={toggleChatVisibility}
                />
              )}
              {isChatVisible && (
                <Chat
                  issue={tempIssue || issues[currentIssue]}
                  loading={loading}
                  issueTemplate={issueTemplate}
                  isChatVisible={isChatVisible}
                  toggleChatVisibility={toggleChatVisibility}
                  isCreatingIssue={isCreatingIssue}
                />
              )}
            </Box>
            {isImprovementsVisible && (
              <ImprovementsList
                improvements={improvements}
                focusedImprovementIndex={focusedImprovementIndex}
                handleImprovementClick={handleImprovementClick}
                handleAcceptImprovement={handleAcceptImprovement}
                handleDiscardImprovement={handleDiscardImprovement}
              />
            )}
          </Box>
        </Box>
      </BaseStyles>
    </ThemeProvider>
  );
}
