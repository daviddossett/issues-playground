import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, Text, TextInput, SegmentedControl, Textarea, IconButton } from "@primer/react";
import { SidebarCollapseIcon, SidebarExpandIcon } from "@primer/octicons-react";
import styles from "./newIssueForm.module.css";
import { Improvement } from "@/app/hooks/useImproveIssue";
import { Issue } from "@/app/page";

interface NewIssueFormProps {
  onCreate: (title: string, body: string) => void;
  onDiscard: () => void;
  onTitleChange: (title: string) => void;
  onBodyChange: (body: string) => void;
  toggleNavVisibility: () => void;
  toggleChatVisibility: () => void;
  isNavVisible: boolean;
  isPanelVisible: boolean;
  improvements: Improvement[] | null;
  focusedImprovementIndex: number | null;
  handleImprovementClick: (index: number) => void;
  issueDraft: Issue | null;
  isRefreshingAfterRewrite: boolean;
}

export const NewIssueForm: React.FC<NewIssueFormProps> = ({
  onCreate,
  onDiscard,
  onTitleChange,
  onBodyChange,
  toggleNavVisibility,
  isNavVisible,
  isPanelVisible,
  toggleChatVisibility,
  improvements,
  focusedImprovementIndex,
  handleImprovementClick,
  issueDraft,
  isRefreshingAfterRewrite,
}) => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>(issueDraft?.body || "");
  const [mode, setMode] = useState<string>("write");

  useEffect(() => {
    setBody(issueDraft?.body || "");
  }, [issueDraft]);

  const renderHighlightedText = (): React.ReactNode => {
    if (!improvements || improvements.length === 0 || isRefreshingAfterRewrite) return body;

    // Find if there's a focused rewrite improvement
    const focusedImprovement = focusedImprovementIndex !== null ? improvements[focusedImprovementIndex] : null;

    // If focused improvement is a rewrite, highlight the entire body
    if (focusedImprovement?.type === "rewrite") {
      return (
        <span
          className={`${styles.highlight} ${styles.focusedHighlight}`}
          onClick={() => handleImprovementClick(focusedImprovementIndex!)}
        >
          {body}
        </span>
      );
    }

    // Sort improvements by their position in the text to avoid highlighting conflicts
    const sortedImprovements = [...improvements].sort((a, b) => {
      const posA = body.toLowerCase().indexOf(a.original.toLowerCase());
      const posB = body.toLowerCase().indexOf(b.original.toLowerCase());
      return posA - posB;
    });

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    sortedImprovements.forEach((improvement, arrayIndex) => {
      // Skip rewrite improvements when showing discrete highlights
      if (improvement.type === "rewrite") return;

      const { original } = improvement;
      if (!original.trim()) return;

      const bodyLower = body.toLowerCase();
      const searchLower = original.toLowerCase();
      const start = bodyLower.indexOf(searchLower, lastIndex);

      if (start === -1) return;

      const actualText = body.slice(start, start + original.length);

      if (start > lastIndex) {
        parts.push(<span key={`text-${arrayIndex}`}>{body.slice(lastIndex, start)}</span>);
      }

      // Find the actual index in the improvements array
      const improvedIndex = improvements.findIndex((imp) => imp === improvement);

      parts.push(
        <span
          key={`highlight-${arrayIndex}`}
          className={`${styles.highlight} ${focusedImprovementIndex === improvedIndex ? styles.focusedHighlight : ""}`}
          onClick={() => handleImprovementClick(improvedIndex)}
        >
          {actualText}
        </span>
      );

      lastIndex = start + original.length;
    });

    if (lastIndex < body.length) {
      parts.push(<span key="text-final">{body.slice(lastIndex)}</span>);
    }

    return parts;
  };

  const handleCreate = (): void => {
    onCreate(title, body);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onTitleChange(newTitle);
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const newBody = e.target.value;
    setBody(newBody);
    onBodyChange(newBody);
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.issueToolbar}>
        <Box className={styles.issueToolbarLeft}>
          {!isNavVisible && (
            <IconButton icon={SidebarCollapseIcon} aria-label="Show nav" onClick={toggleNavVisibility} />
          )}
          <SegmentedControl aria-label="Issue mode">
            <SegmentedControl.Button selected={mode === "write"} onClick={() => setMode("write")}>
              Write
            </SegmentedControl.Button>
            <SegmentedControl.Button selected={mode === "preview"} onClick={() => setMode("preview")}>
              Preview
            </SegmentedControl.Button>
          </SegmentedControl>
        </Box>
        <Box className={styles.issueToolbarRight}>
          {!isPanelVisible && (
            <IconButton icon={SidebarExpandIcon} aria-label="Show chat" onClick={toggleChatVisibility} />
          )}
        </Box>
      </Box>

      <Box className={styles.mainContent}>
        <Box className={styles.innerContainer}>
          <Text as="h2" className={styles.formTitle}>
            New issue
          </Text>
          <Box className={styles.formContainer}>
            <FormControl>
              <FormControl.Label required>Add a title</FormControl.Label>
              <TextInput
                placeholder="Title"
                value={title}
                onChange={handleTitleChange}
                className={styles.issueTitleInput}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Add a description</FormControl.Label>
              <Box className={styles.textareaContainer}>
                <div className={styles.highlightOverlay}>{renderHighlightedText()}</div>
                <Textarea
                  placeholder="Description"
                  value={body}
                  onChange={handleBodyChange}
                  className={styles.issueBodyInput}
                  cols={300}
                  rows={20}
                  resize="vertical"
                  style={{
                    pointerEvents: improvements && improvements.length > 0 ? "none" : "auto",
                  }}
                />
              </Box>
            </FormControl>
            <Box className={styles.buttonContainer}>
              <Button variant="danger" onClick={onDiscard}>
                Discard
              </Button>
              <Button variant="primary" onClick={handleCreate} disabled={!title}>
                Create
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
