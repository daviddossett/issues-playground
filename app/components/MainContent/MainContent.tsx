import { Box, Avatar, Text, IconButton, Button } from "@primer/react";
import { SkeletonText, SkeletonAvatar } from "@primer/react/drafts";
import {
  GoalIcon,
  TriangleDownIcon,
  SyncIcon,
  ScreenFullIcon,
  DeviceMobileIcon,
  SidebarCollapseIcon,
} from "@primer/octicons-react";

import styles from "./MainContent.module.css";
import AIAppMock from "../AIAppMock/AIAppMock";

interface ContentProps {
  isNavVisible: boolean;
  toggleNavVisibility: () => void;
}

export const MainContent: React.FC<ContentProps> = ({ isNavVisible, toggleNavVisibility }) => {
  const IssueContent = () => {
    return (
      <>
        <Box className={styles.issueToolbar}>
          <Box className={styles.issueToolbarLeft}>
            {!isNavVisible && (
              <IconButton
                variant="invisible"
                icon={SidebarCollapseIcon}
                aria-label="Expand sidebar"
                onClick={toggleNavVisibility}
              />
            )}
            <IconButton variant="invisible" icon={GoalIcon} aria-label="Select an element" />
          </Box>
          <Button trailingAction={TriangleDownIcon} variant="invisible">
            Home
          </Button>
          <Box className={styles.issueToolbarRight}>
            <IconButton variant="invisible" icon={SyncIcon} aria-label="Refresh" />
            <IconButton variant="invisible" icon={DeviceMobileIcon} aria-label="Toggle device view" />
            <IconButton variant="invisible" icon={ScreenFullIcon} aria-label="Full screen" />
          </Box>
        </Box>
        <Box className={styles.innerContainer}>
          <Box className={styles.mainContent}>
            <AIAppMock />
          </Box>
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
