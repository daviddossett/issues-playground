import { Message, useChat } from "ai/react";
import { Box, Text, TextInput, FormControl, Stack, Avatar, Octicon, Token } from "@primer/react";
import { PaperAirplaneIcon, CopilotIcon, IssueOpenedIcon, FileIcon } from "@primer/octicons-react";
import { SkeletonText } from "@primer/react/drafts";
import { useCallback, useEffect } from "react";
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
  toggleChatVisibility: () => void;
  isCreatingIssue: boolean;
  onOpenGuidelines: (content: string, title: string) => void; // New prop for opening guidelines
}

export const Chat = ({ issue, loading, issueTemplate, onOpenGuidelines }: ChatProps) => {
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

  useEffect(() => {
    const newPromptWithContext = `${prompt}\n\n${context}`;
    setMessages((prevMessages) => [
      {
        id: "0",
        role: "system",
        content: newPromptWithContext,
      },
      ...prevMessages.filter((m) => m.role !== "system"),
    ]);
  }, [context, prompt, setMessages, issue?.body]);

  const addMessageWithContext = useCallback(
    (event: React.SyntheticEvent) => {
      if (!loading && issue) {
        event.preventDefault();
        handleSubmit(event);
      }
    },
    [issue, handleSubmit, loading]
  );

  const Message = ({ m }: { m: Message }) => {
    return (
      <Box as={"li"} key={m.id} className={styles.messageContainer}>
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
    );
  };

  const ChatMessageList = ({ messages }: { messages: Message[] }) => {
    return (
      <Box as={"ul"} className={styles.messages}>
        {messages
          .filter((m) => m.role !== "system")
          .map((m) => (
            <Message key={m.id} m={m} />
          ))}
      </Box>
    );
  };

  const chatInput = (
    <>
      <form onSubmit={addMessageWithContext} className={styles.form}>
        <Box className={styles.inputContainer}>
          {!loading && issue && issue.title ? (
            <Box className={styles.tokenContainer}>
              <Token
                className={styles.inputIssueToken}
                text={issue.title}
                leadingVisual={() => <Octicon icon={IssueOpenedIcon} size={14} />}
                onClick={() => onOpenGuidelines(issue.body ?? "", issue.title ?? "")}
              />
              {issueTemplate && (
                <Token
                  className={styles.inputIssueToken}
                  text={"Issue guidelines"}
                  leadingVisual={() => <Octicon icon={FileIcon} size={14} />}
                  onClick={() => onOpenGuidelines(issueTemplate, "Issue guidelines")}
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
    </>
  );

  return (
    <Box className={styles.container}>
      <ChatMessageList messages={messages} />
      {chatInput}
    </Box>
  );
};
