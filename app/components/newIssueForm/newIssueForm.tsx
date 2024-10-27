import React, { useState } from "react";
import { Box, Button, FormControl, Text, TextInput, SegmentedControl, Textarea, IconButton } from "@primer/react";
import { SidebarCollapseIcon, SidebarExpandIcon } from "@primer/octicons-react";
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
  const [hoveredImprovement, setHoveredImprovement] = useState<{ proposed: string; reasoning: string } | null>(null);

  const { improvementsList, improvementsListLoading, fetchIssueImprovements } = useImproveIssue(body, issueTemplate);

  const renderHighlightedText = (): React.ReactNode => {
    if (!improvementsList?.improvements) return body;

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    improvementsList.improvements.forEach((improvement, index) => {
      const { original, proposed, reasoning } = improvement;
      const start = body.indexOf(original, lastIndex);

      if (start > lastIndex) {
        parts.push(<span key={`text-${index}`}>{body.slice(lastIndex, start)}</span>);
      }

      parts.push(
        <span
          key={`highlight-${index}`}
          className={styles.highlight}
          onMouseEnter={() => {
            console.log(`Hovered over improvement: ${proposed}`);
            setHoveredImprovement({ proposed, reasoning });
          }}
          onMouseLeave={() => setHoveredImprovement(null)}
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
          {hoveredImprovement && (
            <Box className={styles.hoveredImprovement}>
              <Text as="p">
                <strong>Proposed:</strong> {hoveredImprovement.proposed}
              </Text>
              <Text as="p">
                <strong>Reasoning:</strong> {hoveredImprovement.reasoning}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
