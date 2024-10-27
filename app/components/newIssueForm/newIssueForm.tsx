import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, Text, TextInput, SegmentedControl, Textarea, IconButton } from "@primer/react";
import { SidebarCollapseIcon, SidebarExpandIcon, XIcon } from "@primer/octicons-react";
import styles from "./newIssueForm.module.css";
import { useImproveIssue } from "@/app/hooks/useImproveIssue";

interface NewIssueFormProps {
  onCreate: (title: string, body: string) => void;
  onDiscard: () => void;
  onTitleChange: (title: string) => void;
  onBodyChange: (body: string) => void;
  toggleNavVisibility: () => void;
  toggleChatVisibility: () => void;
  isNavVisible: boolean;
  isChatVisible: boolean;
  issueTemplate: string | null;
}

export const NewIssueForm: React.FC<NewIssueFormProps> = ({
  onCreate,
  onDiscard,
  onTitleChange,
  onBodyChange,
  toggleNavVisibility,
  isNavVisible,
  isChatVisible,
  toggleChatVisibility,
  issueTemplate,
}) => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>(
    `WHEN CLICKING THE "STOP" BUTTON IN THE RUN TOOLBAR, THE SELECTED LAUNCH CONFIGURATION IS STOPPED, AS EXPECTED. However, THE TOOLBAR DISAPPEARS EVEN THOUGH THREE OTHER LAUNCHED CONFIGURATIONS ARE STILL RUNNING, WHICH IS NOT EXPECTED. What is expected is for the toolbar to stay open as long as at least one launched configuration is still alive. 🌊🏴‍☠️ An "all" option in the dropdown to stop, pause, or resume everything at once would be grand, matey! ⚔️☠️⚓️`
  );
  const [mode, setMode] = useState<string>("write");
  const [focusedImprovementIndex, setFocusedImprovementIndex] = useState<number | null>(null);
  const [isImprovementsVisible, setIsImprovementsVisible] = useState<boolean>(false);

  const { improvementsList, improvementsListLoading, fetchIssueImprovements, setImprovementsList } = useImproveIssue(
    body,
    issueTemplate
  );

  useEffect(() => {
    if (!improvementsListLoading && improvementsList?.improvements.length) {
      setIsImprovementsVisible(true);
      setFocusedImprovementIndex(0);
    }
  }, [improvementsListLoading, improvementsList]);

  const renderHighlightedText = (): React.ReactNode => {
    if (!improvementsList?.improvements) return body;

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    improvementsList.improvements.forEach((improvement, index) => {
      const { original } = improvement;
      const start = body.indexOf(original, lastIndex);

      if (start > lastIndex) {
        parts.push(<span key={`text-${index}`}>{body.slice(lastIndex, start)}</span>);
      }

      parts.push(
        <span
          key={`highlight-${index}`}
          className={`${styles.highlight} ${focusedImprovementIndex === index ? styles.focusedHighlight : ""}`}
          onClick={() => setFocusedImprovementIndex(index)}
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

  const handleFetchImprovements = (): void => {
    fetchIssueImprovements();
  };

  const handleCloseImprovements = (): void => {
    setIsImprovementsVisible(false); // Hide improvements container
  };

  const handleImprovementClick = (index: number): void => {
    setFocusedImprovementIndex(index);
  };

  const handleAcceptImprovement = (index: number): void => {
    const improvement = improvementsList?.improvements[index];
    if (!improvement) return;

    const updatedBody = body.replace(improvement.original, improvement.proposed);
    setBody(updatedBody);
    onBodyChange(updatedBody);

    const updatedImprovements = improvementsList.improvements.filter((_, i) => i !== index);
    setImprovementsList({ ...improvementsList, improvements: updatedImprovements });

    if (updatedImprovements.length === 0) {
      setIsImprovementsVisible(false);
    } else {
      setFocusedImprovementIndex(0);
    }
  };

  const handleDiscardImprovement = (index: number): void => {
    if (!improvementsList) return;

    const updatedImprovements = improvementsList.improvements.filter((_, i) => i !== index);
    setImprovementsList({ ...improvementsList, improvements: updatedImprovements });

    if (updatedImprovements.length === 0) {
      setIsImprovementsVisible(false);
    } else {
      setFocusedImprovementIndex(0);
    }
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
        {!isChatVisible && (
          <IconButton icon={SidebarExpandIcon} aria-label="Show chat" onClick={toggleChatVisibility} />
        )}
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
              <Button onClick={handleFetchImprovements} disabled={improvementsListLoading}>
                {improvementsListLoading ? "Fetching Improvements..." : "Fetch Improvements"}
              </Button>
              <Button variant="danger" onClick={onDiscard}>
                Discard
              </Button>
              <Button variant="primary" onClick={handleCreate}>
                Create
              </Button>
            </Box>
          </Box>
        </Box>

        {isImprovementsVisible && (
          <Box className={styles.improvementsContainer}>
            <Box className={styles.improvementsHeader}>
              <Text as="h2">Improvements</Text>
              <IconButton icon={XIcon} aria-label="Close improvements" onClick={handleCloseImprovements} />
            </Box>
            {improvementsList?.improvements.map((improvement, index) => (
              <Box
                key={index}
                className={`${styles.improvementBox} ${focusedImprovementIndex === index ? styles.focusedImprovementBox : ""}`}
                onClick={() => handleImprovementClick(index)}
              >
                <Text as="h3" className={styles.improvementBoxTitle}>
                  Proposed
                </Text>
                <Text as="p" className={styles.improvementBoxCaption}>
                  {improvement.proposed}
                </Text>
                <Text as="h3" className={styles.improvementBoxTitle}>
                  Reasoning
                </Text>
                <Text as="p" className={styles.improvementBoxCaption}>
                  {improvement.reasoning}
                </Text>
                <Box className={styles.improvementBoxButtons}>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptImprovement(index);
                    }}
                  >
                    Apply
                  </Button>
                  <Button
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDiscardImprovement(index);
                    }}
                  >
                    Discard
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
