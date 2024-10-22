import { useChat } from "ai/react";
import { Box, TextInput, FormControl, Stack, Avatar, Octicon, IconButton } from "@primer/react";
import styles from "./chat.module.css";
import { PaperAirplaneIcon, CopilotIcon, SidebarCollapseIcon, PlusIcon } from "@primer/octicons-react";
import { useCallback, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const userAvatarUrl = "https://avatars.githubusercontent.com/u/25163139?v=4";

export default function Chat() {
  const { messages, setMessages, input, handleInputChange, handleSubmit } = useChat();

  useEffect(() => {
    setMessages([
      {
        id: "1",
        role: "system",
        content: "You are an expert in helping users summarize and answer questions about GitHub issues.",
      },
      { id: "2", role: "assistant", content: "Hi, how can I help?" },
    ]);
  }, [setMessages]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit(event);
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
          .filter((m) => m.role !== "system")
          .map((m) => (
            <Box key={m.id} className={styles.messageContainer}>
              {m.role === "user" ? (
                <Box className={styles.userAvatar}>
                  <Avatar src={userAvatarUrl} size={20} />
                </Box>
              ) : (
                <Box className={styles.copilotIcon}>
                  <Octicon icon={CopilotIcon} size={14} />
                </Box>
              )}
              <Box ml={2}>
                <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className={styles.content}>
                  {m.content}
                </Markdown>
              </Box>
            </Box>
          ))}
      </Box>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Box className={styles.inputContainer}>
          <FormControl>
            <TextInput
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={styles.input}
              placeholder="Ask Copilot"
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
