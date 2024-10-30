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
}) => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>(issueDraft?.body || "");
  const [mode, setMode] = useState<string>("write");

  useEffect(() => {
    setBody(issueDraft?.body || "");
  }, [issueDraft]);

  const renderHighlightedText = (): React.ReactNode => {
    if (!improvements) return body;

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    improvements.forEach((improvement, index) => {
      const { original } = improvement;
      if (!original.trim()) return; // Skip empty or whitespace-only strings

      const start = body.indexOf(original, lastIndex);

      if (start === -1) return; // Skip if the original text is not found

      if (start > lastIndex) {
        parts.push(<span key={`text-${index}`}>{body.slice(lastIndex, start)}</span>);
      }

      parts.push(
        <span
          key={`highlight-${index}`}
          className={`${styles.highlight} ${focusedImprovementIndex === index ? styles.focusedHighlight : ""}`}
          onClick={() => handleImprovementClick(index)}
        >
          {original}
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
                  rows={12}
                  resize="vertical"
                />
              </Box>
            </FormControl>
            <Box className={styles.buttonContainer}>
              <Button variant="danger" onClick={onDiscard}>
                Discard
              </Button>
              <Button variant="primary" onClick={handleCreate}>
                Create
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
