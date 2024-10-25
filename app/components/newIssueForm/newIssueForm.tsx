import React, { useState } from "react";
import { Box, Button, FormControl, Text, TextInput, SegmentedControl, Textarea, IconButton } from "@primer/react";
import { SidebarCollapseIcon, SidebarExpandIcon } from "@primer/octicons-react";
import styles from "./newIssueForm.module.css";

interface NewIssueFormProps {
  onCreate: (title: string, body: string) => void;
  onDiscard: () => void;
  onTitleChange: (title: string) => void;
  onBodyChange: (body: string) => void;
  toggleNavVisibility: () => void;
  toggleChatVisibility: () => void;
  isNavVisible: boolean;
  isChatVisible: boolean;
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
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mode, setMode] = useState("write");
  // const [highlightedBody, setHighlightedBody] = useState("");
  // const textareaRef = useRef<HTMLTextAreaElement>(null);
  // const highlightRef = useRef<HTMLDivElement>(null);

  const handleCreate = () => {
    onCreate(title, body);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onTitleChange(newTitle);
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBody = e.target.value;
    setBody(newBody);
    onBodyChange(newBody);
    // highlightWords(newBody);
  };

  // const highlightWords = (text: string) => {
  //   const words = text
  //     .split(/\n/)
  //     .map((line) =>
  //       line
  //         .split(/\s+/)
  //         .map((word) => `<span class="${styles.highlightedWord}">${word}</span>`)
  //         .join(" ")
  //     )
  //     .join("<br>");
  //   setHighlightedBody(words);
  // };

  // useEffect(() => {
  //   if (textareaRef.current && highlightRef.current) {
  //     const syncScroll = () => {
  //       if (textareaRef.current && highlightRef.current) {
  //         highlightRef.current.scrollTop = textareaRef.current.scrollTop;
  //         highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
  //       }
  //     };
  //     const textarea = textareaRef.current;
  //     if (textarea) {
  //       textarea.addEventListener("scroll", syncScroll);
  //       return () => textarea.removeEventListener("scroll", syncScroll);
  //     }
  //   }
  // }, [body]);

  return (
    <Box className={styles.container}>
      <Box className={styles.issueToolbar}>
        <Box className={styles.issueToolbarLeft}>
          {!isNavVisible && (
            <IconButton icon={SidebarCollapseIcon} aria-label="Hide nav" onClick={toggleNavVisibility} />
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
          <IconButton icon={SidebarExpandIcon} aria-label="Hide chat" onClick={toggleChatVisibility} />
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
              {/* <div
                className={styles.highlightOverlay}
                ref={highlightRef}
                dangerouslySetInnerHTML={{ __html: highlightedBody }}
              /> */}
              <Textarea
                placeholder="Description"
                value={body}
                onChange={handleBodyChange}
                className={styles.issueBodyInput}
                // ref={textareaRef}
                cols={300}
                rows={20}
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
  );
};
