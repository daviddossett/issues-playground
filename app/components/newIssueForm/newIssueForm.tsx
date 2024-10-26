import React, { useState } from "react";
import { Box, Button, FormControl, Text, TextInput, SegmentedControl, Textarea, IconButton } from "@primer/react";
import { SidebarCollapseIcon, SidebarExpandIcon } from "@primer/octicons-react";
import styles from "./newIssueForm.module.css";
import { useImproveIssue } from "@/app/hooks/useImproveIssue";

type HighlightPattern = "numbers" | "keywords" | "quotes";

interface Highlight {
  start: number;
  end: number;
  type: HighlightPattern;
}

interface HighlightPatterns {
  [key: string]: RegExp;
}

interface HighlightColors {
  [key: string]: string;
}

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
    `WHEN CLICKING THE "STOP" BUTTON IN THE RUN TOOLBAR, THE SELECTED LAUNCH CONFIGURATION IS STOPPED, AS EXPECTED. HOWEVER, THE TOOLBAR DISAPPEARS EVEN THOUGH THREE OTHER LAUNCHED CONFIGURATIONS ARE STILL RUNNING, WHICH IS NOT EXPECTED. What is expected is for the toolbar to stay open as long as at least one launched configuration is still alive. 🌊🏴‍☠️ An "all" option in the dropdown to stop, pause, or resume everything at once would be grand, matey! ⚔️☠️⚓️`
  );
  const [mode, setMode] = useState<string>("write");
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [activePattern, setActivePattern] = useState<HighlightPattern | null>(null);

  const { improvementsList, improvementsListLoading, fetchIssueImprovements } = useImproveIssue(body, issueTemplate);

  const highlightPatterns: HighlightPatterns = {
    numbers: /\d+/g,
    keywords: /(important|critical)/gi,
    quotes: /"[^"]*"/g,
  };

  const highlightColors: HighlightColors = {
    numbers: styles.bgYellow200,
    keywords: styles.bgGreen200,
    quotes: styles.bgBlue200,
  };

  const applyHighlight = (pattern: HighlightPattern): void => {
    if (activePattern === pattern) return;

    const matches = Array.from(body.matchAll(highlightPatterns[pattern]));
    const newHighlights: Highlight[] = matches.map((match) => ({
      start: match.index!,
      end: match.index! + match[0].length - 1, // Fix the extra character issue
      type: pattern,
    }));

    setHighlights(newHighlights);
    setActivePattern(pattern);
  };

  const clearHighlights = (): void => {
    setHighlights([]);
    setActivePattern(null);
  };

  const renderHighlightedText = (): React.ReactNode => {
    if (highlights.length === 0) return body;

    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    sortedHighlights.forEach((highlight, index) => {
      if (highlight.start > lastIndex) {
        parts.push(<span key={`text-${index}`}>{body.slice(lastIndex, highlight.start)}</span>);
      }

      parts.push(
        <span key={`highlight-${index}`} className={`${highlightColors[highlight.type]}`}>
          {body.slice(highlight.start, highlight.end + 1)}
        </span>
      );

      lastIndex = highlight.end + 1;
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
    clearHighlights(); // Clear highlights when text changes to prevent invalid highlights
  };

  const handleFetchImprovements = (): void => {
    fetchIssueImprovements();
  };

  const ImprovementsList = () => {
    return (
      <Box className={styles.improvementsContainer}>
        {improvementsList?.improvements &&
          improvementsList.improvements.map(
            (improvement: { original: string; proposed: string; reasoning: string }, index: number) => (
              <Box key={index} className={styles.improvementItem}>
                <Text as="p">
                  <strong>{index + 1}. Original:</strong> {improvement.original}
                </Text>
                <Text as="p">
                  <strong>Proposed:</strong> {improvement.proposed}
                </Text>
                <Text as="p">
                  <strong>Reasoning:</strong> {improvement.reasoning}
                </Text>
              </Box>
            )
          )}
      </Box>
    );
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
          <SegmentedControl aria-label="Highlight pattern">
            <SegmentedControl.Button selected={activePattern === null} onClick={clearHighlights}>
              Original
            </SegmentedControl.Button>
            {(Object.keys(highlightPatterns) as HighlightPattern[]).map((pattern) => (
              <SegmentedControl.Button
                key={pattern}
                selected={activePattern === pattern}
                onClick={() => applyHighlight(pattern)}
              >
                {`Highlight ${pattern.charAt(0).toUpperCase() + pattern.slice(1)}`}
              </SegmentedControl.Button>
            ))}
          </SegmentedControl>
          <Box className={styles.buttonContainer}>
            <Button variant="danger" onClick={onDiscard}>
              Discard
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Create
            </Button>
            <Button onClick={handleFetchImprovements} disabled={improvementsListLoading}>
              {improvementsListLoading ? "Fetching Improvements..." : "Fetch Improvements"}
            </Button>
          </Box>
          <ImprovementsList />
        </Box>
      </Box>
    </Box>
  );
};
