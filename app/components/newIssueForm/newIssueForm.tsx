import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, Text, TextInput, SegmentedControl, Textarea, IconButton } from "@primer/react";
import { SidebarCollapseIcon, SidebarExpandIcon } from "@primer/octicons-react";
import styles from "./newIssueForm.module.css";
import { Issue } from "@/app/page";

interface NewIssueFormProps {
  onCreate: (title: string, body: string) => void;
  onDiscard: () => void;
  toggleNavVisibility: () => void;
  toggleChatVisibility: () => void;
  issueDraft: Issue | null;
}

export const NewIssueForm: React.FC<NewIssueFormProps> = ({
  onCreate,
  onDiscard,
  toggleNavVisibility,
  toggleChatVisibility,
  issueDraft,
}) => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>(issueDraft?.body || "");
  const [mode, setMode] = useState<string>("write");

  useEffect(() => {
    setBody(issueDraft?.body || "");
  }, [issueDraft]);

  const handleCreate = (): void => {
    onCreate(title, body);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const newBody = e.target.value;
    setBody(newBody);
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.issueToolbar}>
        <Box className={styles.issueToolbarLeft}>
          <IconButton icon={SidebarCollapseIcon} aria-label="Show nav" onClick={toggleNavVisibility} />
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
          <IconButton icon={SidebarExpandIcon} aria-label="Show chat" onClick={toggleChatVisibility} />
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
                <Textarea
                  placeholder="Description"
                  value={body}
                  onChange={handleBodyChange}
                  className={styles.issueBodyInput}
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
