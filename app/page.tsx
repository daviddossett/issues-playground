"use client";

import { ThemeProvider, BaseStyles, Box } from "@primer/react";
import { useState, useEffect } from "react";
import { AppHeader } from "./components/header/header";
import { Navigation } from "./components/navigation/navigation";
import { IssueContent } from "./components/issue/issueContent";
import { useIssues } from "./hooks/useIssues";
import { useImproveIssue } from "./hooks/useImproveIssue";
import { RepoHeader } from "./components/repoHeader/repoHeader";
import { Endpoints } from "@octokit/types";
import { NewIssueForm } from "./components/newIssueForm/newIssueForm";
import { createIssue, fetchFileContent } from "./client";
import styles from "./page.module.css";
import { SidePanel } from "./components/sidePanel/sidePanel";

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
  const [issueDraft, setIssueDraft] = useState<Issue | null>(null);
  const [issueTemplate, setIssueTemplate] = useState<string | null>(null);
  const [focusedImprovementIndex, setFocusedImprovementIndex] = useState<number | null>(0);

  const [isPanelVisible, setisPanelVisible] = useState<boolean>(true);
  const [isNavVisible, setIsNavVisible] = useState<boolean>(true);

  const { issues, loading, loadMoreIssues, hasMore } = useIssues(selectedRepo);
  const { improvements, setImprovements, fetchIssueImprovements, improvementsLoading } = useImproveIssue(
    issueDraft?.body || "",
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

    const newIssueDraft = {
      id: Date.now(),
      title: "New issue",
      body: sampleBody,
      user: { login: "current_user" },
      created_at: new Date().toISOString(),
    } as Issue;
    setIssueDraft(newIssueDraft);
    setIsCreatingIssue(true);
    setCurrentIssue(0);
    setisPanelVisible(true);
    setIsNavVisible(false);
  };

  const handleTitleChange = (title: string) => setIssueDraft((prev) => prev && { ...prev, title });

  const handleBodyChange = (body: string) => setIssueDraft((prev) => prev && { ...prev, body });

  const handleCreateIssue = async (title: string, body: string) => {
    try {
      const newIssue = await createIssue(selectedRepo, title, body);
      issues.unshift(newIssue);
      setIssueDraft(null);
      setIsCreatingIssue(false);
      setCurrentIssue(0);
    } catch (error) {
      console.error("Failed to create issue:", error);
    }
  };

  const handleDiscardIssue = () => {
    setIssueDraft(null);
    setIsCreatingIssue(false);
    setCurrentIssue(0);
    setisPanelVisible(true);
    setIsNavVisible(true);
    setImprovements(null);
  };

  const toggleNavVisibility = () => {
    setIsNavVisible(!isNavVisible);
  };

  const toggleChatVisibility = () => {
    setisPanelVisible(!isPanelVisible);
  };

  const handleImprovementClick = (index: number) => {
    setFocusedImprovementIndex(index);
  };

  const handleAcceptImprovement = (index: number) => {
    if (!improvements || !issueDraft?.body) return;

    const improvement = improvements[index];
    const updatedBody = issueDraft.body.replace(improvement.original, improvement.proposed);
    setIssueDraft((prev) => prev && { ...prev, body: updatedBody });
    setImprovements((prevImprovements) => prevImprovements?.filter((_, i) => i !== index) || []);
  };

  const handleDiscardImprovement = (index: number) => {
    if (!improvements) return;

    const updatedImprovements = improvements.filter((_, i) => i !== index);
    setImprovements(updatedImprovements);
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
                  issues={issueDraft ? [issueDraft, ...issues] : issues}
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
                  onTitleChange={handleTitleChange}
                  onBodyChange={handleBodyChange}
                  toggleNavVisibility={toggleNavVisibility}
                  toggleChatVisibility={toggleChatVisibility}
                  isNavVisible={isNavVisible}
                  isPanelVisible={isPanelVisible}
                  improvements={improvements}
                  focusedImprovementIndex={focusedImprovementIndex}
                  handleImprovementClick={handleImprovementClick}
                  issueDraft={issueDraft}
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
                  isPanelVisible={isPanelVisible}
                  toggleChatVisibility={toggleChatVisibility}
                />
              )}
              {isPanelVisible && (
                <SidePanel
                  issue={issueDraft || issues[currentIssue]}
                  loading={loading}
                  issueTemplate={issueTemplate}
                  isPanelVisible={isPanelVisible}
                  toggleChatVisibility={toggleChatVisibility}
                  isCreatingIssue={isCreatingIssue}
                  improvements={improvements}
                  improvementsLoading={improvementsLoading}
                  focusedImprovementIndex={focusedImprovementIndex}
                  handleImprovementClick={handleImprovementClick}
                  handleAcceptImprovement={handleAcceptImprovement}
                  handleDiscardImprovement={handleDiscardImprovement}
                  onFetchImprovements={handleFetchImprovements}
                />
              )}
            </Box>
          </Box>
        </Box>
      </BaseStyles>
    </ThemeProvider>
  );
}
