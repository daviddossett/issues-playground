import { useState } from "react";
import { Box, Button, FormControl, Text, TextInput, Textarea } from "@primer/react";
import styles from "./newIssueForm.module.css";

interface NewIssueFormProps {
  onCreate: (title: string, body: string) => void;
  onDiscard: () => void;
}

export const NewIssueForm: React.FC<NewIssueFormProps> = ({ onCreate, onDiscard }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleCreate = () => {
    onCreate(title, body);
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.innerContainer}>
        <Text as="h2" className={styles.formTitle}>
          New issue
        </Text>
        <Box className={styles.formContainer}>
          <FormControl>
            <FormControl.Label>Title</FormControl.Label>
            <TextInput
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.issueTitleInput}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Description</FormControl.Label>
            <Textarea
              placeholder="Description"
              value={body}
              onChange={(e) => setBody(e.target.value)}
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
