import { Box, IconButton, SegmentedControl, Dialog } from "@primer/react";
import { SidebarCollapseIcon } from "@primer/octicons-react";
import { Chat } from "../chat/chat";
import { ImprovementsList } from "../improvementsList/improvementsList";
import styles from "./sidePanel.module.css";
import { Improvement } from "@/app/hooks/useImproveIssue";
import { Issue, Repo } from "@/app/page";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface SidePanelProps {
  issue: Issue;
  loading: boolean;
  issueGuidelines: string | null;
  isPanelVisible: boolean;
  toggleChatVisibility: () => void;
  isCreatingIssue: boolean;
  improvements: Improvement[] | null;
  improvementsLoading: boolean;
  focusedImprovementIndex: number | null;
  handleImprovementClick: (index: number) => void;
  handleAcceptImprovement: (index: number) => void;
  handleDiscardImprovement: (index: number) => void;
  onFetchImprovements: () => void;
  selectedRepo: Repo;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  issue,
  loading,
  issueGuidelines,
  isPanelVisible,
  toggleChatVisibility,
  isCreatingIssue,
  improvements,
  improvementsLoading,
  focusedImprovementIndex,
  handleImprovementClick,
  handleAcceptImprovement,
  handleDiscardImprovement,
  onFetchImprovements,
  selectedRepo,
}) => {
  const [selectedTab, setSelectedTab] = useState<"chat" | "improvements">("chat");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (content: string, title: string) => {
    setModalContent(content);
    setModalTitle(`${title} for ${selectedRepo.owner}/${selectedRepo.name}`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
    setModalTitle("");
  };

  return (
    <Box className={`${styles.container} ${isPanelVisible ? styles.chatVisible : styles.chatHidden}`}>
      <Box className={styles.toolbar}>
        <SegmentedControl aria-label="Side panel mode">
          <SegmentedControl.Button selected={selectedTab === "chat"} onClick={() => setSelectedTab("chat")}>
            Chat
          </SegmentedControl.Button>
          <SegmentedControl.Button
            selected={selectedTab === "improvements"}
            onClick={() => setSelectedTab("improvements")}
          >
            Feedback
          </SegmentedControl.Button>
        </SegmentedControl>
        <IconButton icon={SidebarCollapseIcon} aria-label="Hide panel" onClick={toggleChatVisibility} />
      </Box>
      <Box className={styles.content}>
        {selectedTab === "chat" ? (
          <Chat
            issue={issue}
            loading={loading}
            issueGuidelines={issueGuidelines}
            toggleChatVisibility={toggleChatVisibility}
            isCreatingIssue={isCreatingIssue}
            onOpenGuidelines={openModal}
          />
        ) : (
          <ImprovementsList
            improvements={improvements}
            focusedImprovementIndex={focusedImprovementIndex}
            handleImprovementClick={handleImprovementClick}
            handleAcceptImprovement={handleAcceptImprovement}
            handleDiscardImprovement={handleDiscardImprovement}
            loading={improvementsLoading}
            onFetchImprovements={onFetchImprovements}
            onOpenGuidelines={() => openModal(issueGuidelines || "", "Issue guidelines")}
          />
        )}
      </Box>
      <Dialog isOpen={isModalOpen} onDismiss={closeModal} aria-labelledby="modal-title" wide className={styles.dialog}>
        <Dialog.Header id="modal-title">{modalTitle}</Dialog.Header>
        <Box className={styles.dialogBody}>
          <Box p={4} className={styles.dialogMarkdown}>
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {modalContent}
            </Markdown>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};
