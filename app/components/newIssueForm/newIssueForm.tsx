import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Text,
  TextInput,
  SegmentedControl,
  Textarea,
  IconButton,
  Spinner,
} from "@primer/react";
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
    `I'M SO ANGRY THAT THE TITLEBAR IS BROKEN AND HERE ARE MY EMOJIS TO PROVE IT 😡😡😡`
  );
  const [mode, setMode] = useState<string>("write");
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [activePattern, setActivePattern] = useState<HighlightPattern | null>(null);

  const { improvements, improvementsLoading, fetchIssueImprovements } = useImproveIssue(body, issueTemplate);

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
        <span
          key={`highlight-${index}`}
          className={`${highlightColors[highlight.type]} ${styles.rounded} ${styles.px1}`}
        >
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
            <Button onClick={handleFetchImprovements} disabled={improvementsLoading}>
              {improvementsLoading ? "Fetching Improvements..." : "Fetch Improvements"}
            </Button>
          </Box>

          <Box className={styles.improvementsContainer}>
            <Text as="h3">Improvements</Text>
            {improvementsLoading ? (
              <Spinner size="small" />
            ) : (
              improvements && (
                <Box className={styles.improvement}>
                  <Text as="p">
                    <strong>Proposed:</strong> {improvements}
                  </Text>
                </Box>
              )
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
