import { useChat } from "ai/react";
import { Box, Text, TextInput, FormControl, Stack, Avatar, Octicon, IconButton, Token } from "@primer/react";
import styles from "./chat.module.css";
import { PaperAirplaneIcon, CopilotIcon, SidebarCollapseIcon, PlusIcon, IssueOpenedIcon } from "@primer/octicons-react";
import { SkeletonText } from "@primer/react/drafts";
import { useCallback, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Issue } from "@/app/page";

const userAvatarUrl = "https://avatars.githubusercontent.com/u/25163139?v=4"; // Hardcoded to me for now

interface ChatProps {
  issue: Issue;
  loading: boolean;
}

export default function Chat({ issue, loading }: ChatProps) {
  const { messages, setMessages, input, handleInputChange, handleSubmit } = useChat();
  const issueRef = useRef<Issue | null>(null);
  const [initialMessageDisplayed, setInitialMessageDisplayed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Set the welcome message
  useEffect(() => {
    if (!initialMessageDisplayed) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `${Date.now()}`,
          role: "assistant",
          content: "Welcome! How can I help you?",
        },
      ]);
      setInitialMessageDisplayed(true);
    }
  }, [initialMessageDisplayed, setMessages]);

  // Set the system message
  useEffect(() => {
    if (!loading && issue?.title && issue?.body && issue !== issueRef.current) {
      issueRef.current = issue;
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `${Date.now()}`,
          role: "system",
          content: `You are an expert in helping users summarize and answer questions about GitHub issues. The current issue is: ${issue.title}. The issue description is: ${issue.body}. If asked for summaries, be very brief. Use one or two sentences followed by 2-3 bullets at most.`,
        },
      ]);
    }
  }, [issue, loading, setMessages]);

  // Scroll to the bottom when a new message is added. This needs work.
  useEffect(() => {
    if (messages.length > 0 && !hasScrolled) {
      const middlePosition =
        (messagesEndRef.current?.offsetTop ?? 0) - (messagesEndRef.current?.parentElement?.clientHeight ?? 0) / 2;
      messagesEndRef.current?.parentElement?.scrollTo({ top: middlePosition - 50, behavior: "smooth" });
      setHasScrolled(true);
    }
  }, [messages, hasScrolled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit(event);
        setHasScrolled(false); // Reset scroll state for the next message
      }
    },
    [handleSubmit]
  );

  return (
    <Box className={styles.container}>
      <Box className={styles.toolbar}>
        <IconButton icon={PlusIcon} aria-label="New thread" />
        <IconButton icon={SidebarCollapseIcon} aria-label="Hide sidebar" />
      </Box>
      <Box className={styles.messages}>
        {messages
          .filter((m) => m.role !== "system") // Don't render the system message. Maybe there's a better way to do this.
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
        <div ref={messagesEndRef} />
      </Box>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Box className={styles.inputContainer}>
          {!loading && issue ? (
            <Token
              className={styles.inputIssueToken}
              text={issue.title}
              leadingVisual={() => <Octicon icon={IssueOpenedIcon} size={14} />}
            />
          ) : (
            <SkeletonText maxWidth={100} />
          )}

          <FormControl>
            <FormControl.Label visuallyHidden={true}>Ask Copilot</FormControl.Label>
            <TextInput
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
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
                  <TextInput.Action onClick={handleSubmit} icon={PaperAirplaneIcon} aria-label="Submit" />
                </Stack>
              }
            />
          </FormControl>
        </Box>
      </form>
    </Box>
  );
}
