import {
  MarkGithubIcon,
  BrowserIcon,
  CodeIcon,
  DuplicateIcon,
  GearIcon,
  KebabHorizontalIcon,
  MirrorIcon,
  ThreeBarsIcon,
} from "@primer/octicons-react";
import { Header, Octicon, IconButton, SegmentedControl, Avatar, Button, Box } from "@primer/react";

import styles from "./header.module.css";

interface AppHeaderProps {
  viewMode: "preview" | "code" | "split";
  onViewModeChange: (mode: "preview" | "code" | "split") => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <Header className={styles.header}>
      <Box display="flex" alignItems="center">
        <IconButton icon={ThreeBarsIcon} aria-label="Menu" variant="invisible" className={styles.iconButton} />
        <Header.Link href="#" fontSize={2} className={styles.headerLink}>
          <Octicon icon={MarkGithubIcon} size={32} className={styles.octicon} />
          Spark
        </Header.Link>
      </Box>
      <div className={styles.headerActions}>
        <SegmentedControl aria-label="View switcher">
          <SegmentedControl.IconButton
            selected={viewMode === "preview"}
            aria-label="Browser view"
            icon={BrowserIcon}
            onClick={() => onViewModeChange("preview")}
          />
          <SegmentedControl.IconButton
              selected={viewMode === "code"}
              aria-label="Code view"
              icon={CodeIcon}
              onClick={() => onViewModeChange("code")}
            />
          <SegmentedControl.IconButton
            selected={viewMode === "split"}
            aria-label="Split view"
            icon={MirrorIcon}
            onClick={() => onViewModeChange("split")}
          />
        </SegmentedControl>
        <IconButton icon={DuplicateIcon} aria-label="Duplicate" variant="invisible" className={styles.iconButton} />
        <IconButton icon={GearIcon} aria-label="Settings" variant="invisible" className={styles.iconButton} />
        <IconButton icon={KebabHorizontalIcon} aria-label="More" variant="invisible" className={styles.iconButton} />
        <Button variant="primary">Publish</Button>
        <Avatar src="https://github.com/octocat.png" size={32} />
      </div>
    </Header>
  );
};
