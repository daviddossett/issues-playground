import { Box, Avatar, Text, IconButton, Button } from "@primer/react";
import { SkeletonText, SkeletonAvatar } from "@primer/react/drafts";
import { GoalIcon, TriangleDownIcon, SyncIcon, ScreenFullIcon, DeviceMobileIcon } from "@primer/octicons-react";

import styles from "./MainContent.module.css";

interface ContentProps {
  isNavVisible: boolean;
  toggleNavVisibility: () => void;
  isPanelVisible: boolean;
  toggleChatVisibility: () => void;
}

export const MainContent: React.FC<ContentProps> = ({
  isNavVisible,
  toggleNavVisibility,
  isPanelVisible,
  toggleChatVisibility,
}) => {
  const IssueContent = () => {
    return (
      <>
        <Box className={styles.issueToolbar}>
          <Box className={styles.issueToolbarLeft}>
            <IconButton variant="invisible" icon={GoalIcon} aria-label="Select an element" />
          </Box>
          <Button trailingAction={TriangleDownIcon} variant="invisible">
            Home
          </Button>
          <Box className={styles.issueToolbarRight}>
            <IconButton variant="invisible" icon={SyncIcon} aria-label="More" />
            <IconButton variant="invisible" icon={DeviceMobileIcon} aria-label="More" />
            <IconButton variant="invisible" icon={ScreenFullIcon} aria-label="More" />
          </Box>
        </Box>
        <Box className={styles.innerContainer}>
          <Box className={styles.issueHeader}></Box>
          <Box className={styles.mainContent}></Box>
        </Box>
      </>
    );
  };

  return (
    <Box className={styles.container}>
      <IssueContent />
    </Box>
  );
};
