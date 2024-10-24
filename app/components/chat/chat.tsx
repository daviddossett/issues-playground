import { Message, useChat } from "ai/react";
import { Box, Text, TextInput, FormControl, Stack, Avatar, Octicon, IconButton, Token, Dialog } from "@primer/react";
import {
  PaperAirplaneIcon,
  CopilotIcon,
  SidebarCollapseIcon,
  PlusIcon,
  IssueOpenedIcon,
  FileIcon,
} from "@primer/octicons-react";
import { SkeletonText } from "@primer/react/drafts";
import { useCallback, useState, useEffect } from "react";
import styles from "./chat.module.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Issue } from "@/app/page";

const userAvatarUrl = "https://avatars.githubusercontent.com/u/25163139?v=4";

interface ChatProps {
  issue: Issue;
  loading: boolean;
  issueTemplate: string | null;
}

export default function Chat({ issue, loading, issueTemplate }: ChatProps) {
  const prompt = `You are an expert in helping users answer questions and write or revise GitHub issues.`;
  const context = issue
    ? `Context: ${issue.title}\n\n${issue.body}\n\n Follow these guidelines if asked to rewrite an issue: ${issueTemplate} `
    : "";

  const initialMessageSet: Message[] = [
    {
      id: "0",
      role: "system",
      content: `${prompt}\n\n${context}`,
    },
    {
      id: "1",
      role: "assistant",
      content: "Hi, how can I help?",
    },
  ];

  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    initialMessages: initialMessageSet,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (content: string, title: string) => {
    setModalContent(content);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
    setModalTitle("");
  };

  const addMessageWithContext = useCallback(
    (event: React.SyntheticEvent) => {
      if (!loading && issue) {
        event.preventDefault();
        handleSubmit(event);
      }
    },
    [issue, handleSubmit, loading]
  );

  useEffect(() => {
    const newPromptWithContext = `${prompt}\n\n${context}`;
    setMessages([
      {
        id: "0",
        role: "system",
        content: newPromptWithContext,
      },
      ...messages.filter((m) => m.role !== "system"),
    ]);
  }, [context, issue, messages, prompt, setMessages]);

  return (
    <Box className={styles.container}>
      <Box className={styles.toolbar}>
        <IconButton icon={PlusIcon} aria-label="New thread" />
        <IconButton icon={SidebarCollapseIcon} aria-label="Hide sidebar" />
      </Box>
      <Box className={styles.messages}>
        {messages
          .filter((m) => m.role !== "system")
          .map((m) => (
            <Box key={m.id} className={styles.messageContainer}>
              <Box className={styles.messageHeader}>
                {m.role === "user" ? (
                  <>
                    <Avatar src={userAvatarUrl} size={24} />
                    <Text>daviddossett</Text>
                  </>
                ) : (
                  <>
                    <Box className={styles.copilotIcon}>
                      <Octicon icon={CopilotIcon} size={14} />
                    </Box>
                    <Text>Copilot</Text>
                  </>
                )}
              </Box>

              <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className={styles.content}>
                {m.content}
              </Markdown>
            </Box>
          ))}
      </Box>
      <form onSubmit={addMessageWithContext} className={styles.form}>
        <Box className={styles.inputContainer}>
          {!loading && issue && issue.title ? (
            <Box className={styles.tokenContainer}>
              <Token
                className={styles.inputIssueToken}
                text={issue.title}
                leadingVisual={() => <Octicon icon={IssueOpenedIcon} size={14} />}
                onClick={() => openModal(issue.body ?? "", issue.title ?? "")}
              />
              {issueTemplate && (
                <Token
                  className={styles.inputIssueToken}
                  text={"Issue guidelines"}
                  leadingVisual={() => <Octicon icon={FileIcon} size={14} />}
                  onClick={() => openModal(issueTemplate, "Issue guidelines")}
                />
              )}
            </Box>
          ) : (
            <SkeletonText maxWidth={100} />
          )}

          <FormControl>
            <FormControl.Label visuallyHidden={true}>Ask Copilot</FormControl.Label>
            <TextInput
              value={input}
              onChange={handleInputChange}
              className={styles.input}
              placeholder={"Ask Copilot"}
              size="large"
              trailingAction={
                <Stack
                  justify="center"
                  style={{
                    minWidth: "34px",
                  }}
                >
                  <TextInput.Action onClick={addMessageWithContext} icon={PaperAirplaneIcon} aria-label="Submit" />
                </Stack>
              }
            />
          </FormControl>
        </Box>
      </form>

      <Dialog isOpen={isModalOpen} onDismiss={closeModal} aria-labelledby="modal-title" wide>
        <Dialog.Header id="modal-title">{modalTitle}</Dialog.Header>
        <Box p={4} className={styles.dialogMarkdown}>
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {modalContent}
          </Markdown>
        </Box>
      </Dialog>
    </Box>
  );
}
