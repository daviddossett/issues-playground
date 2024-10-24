import { useState } from "react";
import { Box, Button, FormControl, Text, TextInput, Textarea, SegmentedControl } from "@primer/react"; // Added SegmentedControl
import styles from "./newIssueForm.module.css";

interface NewIssueFormProps {
  onCreate: (title: string, body: string) => void;
  onDiscard: () => void;
  onTitleChange: (title: string) => void;
  onBodyChange: (body: string) => void;
}

export const NewIssueForm: React.FC<NewIssueFormProps> = ({ onCreate, onDiscard, onTitleChange, onBodyChange }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mode, setMode] = useState("write"); // Added state for mode

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
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.issueToolbar}>
        <SegmentedControl aria-label="Issue mode">
          <SegmentedControl.Button selected={mode === "write"} onClick={() => setMode("write")}>
            Write
          </SegmentedControl.Button>
          <SegmentedControl.Button selected={mode === "preview"} onClick={() => setMode("preview")}>
            Preview
          </SegmentedControl.Button>
        </SegmentedControl>
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
            <Textarea
              placeholder="Description"
              value={body}
              onChange={handleBodyChange}
              className={styles.issueBodyInput}
              cols={300}
              rows={20}
            />
          </FormControl>
          <Box className={styles.buttonContainer}>
            <Button variant="primary" onClick={handleCreate}>
              Create
            </Button>
            <Button variant="danger" onClick={onDiscard}>
              Discard
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
