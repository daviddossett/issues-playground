import { Box, Button, IconButton } from "@primer/react";
import {
  SidebarCollapseIcon,
  GoalIcon,
  TriangleDownIcon,
  SyncIcon,
  DeviceMobileIcon,
  ScreenFullIcon,
} from "@primer/octicons-react";
import styles from "./MainContent.module.css";
import AIAppMock from "../AIAppMock/AIAppMock";

interface ContentProps {
  isNavVisible: boolean;
  toggleNavVisibility: () => void;
  isIterating: boolean;
  setIsIterating: (isIterating: boolean) => void;
  viewMode: "preview" | "code" | "split";
}

export const MainContent: React.FC<ContentProps> = ({
  isNavVisible,
  toggleNavVisibility,
  isIterating,
  setIsIterating,
}) => {
  return (
    <Box className={styles.container}>
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
          <AIAppMock isIterating={isIterating} setIsIterating={setIsIterating} />
        </Box>
      </Box>
    </Box>
  );
};
