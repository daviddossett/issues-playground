"use client";

import { ThemeProvider, BaseStyles, Box } from "@primer/react";
import { useState, useEffect } from "react";
import { AppHeader } from "./components/header/header";
import { Navigation } from "./components/navigation/navigation";
import { IssueContent } from "./components/issue/issueContent";
import { useIssues } from "./hooks/useIssues";
import { Improvement, useImproveIssue } from "./hooks/useImproveIssue";
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
  const [issueGuidelines, setIssueGuidelines] = useState<string | null>(null);
  const [focusedImprovementIndex, setFocusedImprovementIndex] = useState<number | null>(null);

  const [isPanelVisible, setisPanelVisible] = useState<boolean>(true);
  const [isNavVisible, setIsNavVisible] = useState<boolean>(true);
  const [isRefreshingAfterRewrite, setIsRefreshingAfterRewrite] = useState(false);

  const { issues, loading, loadMoreIssues, hasMore } = useIssues(selectedRepo);
  const { improvements, setImprovements, fetchIssueImprovements, improvementsLoading } = useImproveIssue(
    issueDraft?.body || "",
    issueGuidelines
  );

  useEffect(() => {
    if (issues.length > 0 && currentIssue >= issues.length) {
      setCurrentIssue(0);
    }
  }, [currentIssue, issues]);

  useEffect(() => {
    const fetchIssueGuidelines = async () => {
      try {
        const content = await fetchFileContent(selectedRepo, ".github/issue-guidelines.md");
        setIssueGuidelines(content);
      } catch (error) {
        console.error("Failed to fetch issue guideline:", error);
        setIssueGuidelines(null);
      }
    };

    fetchIssueGuidelines();
  }, [selectedRepo]);

  const handleRepoSelection = (repo: Repo) => {
    setSelectedRepo(repo);
    setCurrentIssue(0);
    setIssueGuidelines(null);
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
    const sampleBody = "";

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

  const handleBodyChange = (body: string) => {
    setIssueDraft((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        body: body,
      };
      return updated;
    });
  };

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

  const handleAcceptImprovement = async (index: number) => {
    if (!improvements || !issueDraft?.body) return;

    const improvement = improvements[index];

    // Validate that the improvement can be applied
    if (!issueDraft.body.includes(improvement.original)) {
      console.error("Cannot apply improvement - original text not found in body");
      return;
    }

    const updatedBody = issueDraft.body.replace(improvement.original, improvement.proposed);

    // Update the draft
    handleBodyChange(updatedBody);

    if (improvement.type === "rewrite") {
      // Immediately remove the rewrite improvement
      setImprovements(improvements.filter((imp) => imp.type === "discrete"));
      setFocusedImprovementIndex(null);
      setIsRefreshingAfterRewrite(true);

      try {
        // Wait for the draft update to complete
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Pass the updated body directly to get new improvements
        const response = await fetchIssueImprovements(updatedBody);

        if (response?.items) {
          // Only keep discrete improvements after a rewrite
          const validatedImprovements = response.items
            .filter((imp: Improvement) => imp.type === "discrete")
            .filter((imp: Improvement) => updatedBody.includes(imp.original));

          if (validatedImprovements.length > 0) {
            setImprovements(validatedImprovements);
            setFocusedImprovementIndex(0);
          }
        }
      } catch (error) {
        console.error("Failed to fetch new improvements:", error);
      } finally {
        setIsRefreshingAfterRewrite(false);
      }
    } else {
      // When accepting a discrete improvement, filter out any rewrite improvements
      // along with the accepted improvement
      const updatedImprovements = improvements.filter((imp, i) => i !== index && imp.type !== "rewrite");
      setImprovements(updatedImprovements);

      // Update focus
      if (updatedImprovements.length > 0) {
        const nextIndex = index < updatedImprovements.length ? index : updatedImprovements.length - 1;
        setFocusedImprovementIndex(nextIndex);
      } else {
        setFocusedImprovementIndex(null);
      }
    }
  };

  const handleDiscardImprovement = (index: number) => {
    if (!improvements) return;

    const updatedImprovements = improvements.filter((_, i) => i !== index);
    setImprovements(updatedImprovements);

    // Focus the next improvement if available, otherwise the previous one
    if (updatedImprovements.length > 0) {
      if (index < updatedImprovements.length) {
        setFocusedImprovementIndex(index);
      } else {
        setFocusedImprovementIndex(updatedImprovements.length - 1);
      }
    } else {
      setFocusedImprovementIndex(null);
    }
  };

  const handleFetchImprovements = async () => {
    const data = await fetchIssueImprovements();
    if (data?.items && data.items.length > 0) {
      setImprovements(data.items);
      // Ensure we set focus after improvements are loaded
      setFocusedImprovementIndex(0);
    }
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
          />
          <Box className={styles.innerContainer}>
            <Box className={styles.mainContent}>
              {isNavVisible && (
                <Navigation
                  onSetCurrentIssue={setCurrentIssue}
                  currentIssue={currentIssue}
                  issues={issueDraft ? [issueDraft, ...issues] : issues}
                  loading={loading}
                  toggleNavVisibility={toggleNavVisibility}
                />
              )}
              {isCreatingIssue ? (
                <NewIssueForm
                  onCreate={handleCreateIssue}
                  onDiscard={handleDiscardIssue}
                  toggleNavVisibility={toggleNavVisibility}
                  toggleChatVisibility={toggleChatVisibility}
                  issueDraft={issueDraft}
                />
              ) : (
                <IssueContent
                  issue={issues[currentIssue]}
                  loading={loading}
                  currentIssue={currentIssue}
                  onSetCurrentIssue={handlesetCurrentIssue}
                  toggleChatVisibility={toggleChatVisibility}
                />
              )}
              {isPanelVisible && (
                <SidePanel
                  issue={issueDraft || issues[currentIssue]}
                  loading={loading}
                  issueGuidelines={issueGuidelines}
                  toggleChatVisibility={toggleChatVisibility}
                  isCreatingIssue={isCreatingIssue}
                  selectedRepo={selectedRepo}
                />
              )}
            </Box>
          </Box>
        </Box>
      </BaseStyles>
    </ThemeProvider>
  );
}
