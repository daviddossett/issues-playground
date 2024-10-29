import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, Text, TextInput, SegmentedControl, Textarea, IconButton } from "@primer/react";
import { CopilotIcon, SidebarCollapseIcon, SidebarExpandIcon } from "@primer/octicons-react";
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

export const sampleBody = `THIS THING IS ALWAYS BROKEN 😡

It's almost as if you're trying to create a terrible app. It never generates the right grid layouts AND EVEN IF IT DID the css it spits out just overflows off the page, so I can't see it.

Do better, guys.`;

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
  const [body, setBody] = useState<string>(sampleBody);
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
              <Button leadingVisual={CopilotIcon} onClick={handleFetchImprovements} disabled={improvementsListLoading}>
                Refine issue
              </Button>
              <Button variant="danger" onClick={onDiscard}>
                Discard
              </Button>
              <Button variant="primary" onClick={handleCreate}>
                Create
              </Button>
            </Box>
            {isImprovementsVisible && (
              <Box className={styles.improvementsContainer}>
                <Box className={styles.improvementsHeader}>
                  <Text as="h2">Improvements</Text>
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
                      {improvement.proposed || "[Suggest to remove this based on issue guidelines]"}
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
      </Box>
    </Box>
  );
};
