import {
  MarkGithubIcon,
  BrowserIcon,
  CodeIcon,
  DuplicateIcon,
  GearIcon,
  KebabHorizontalIcon,
} from "@primer/octicons-react";
import { Header, Octicon, IconButton, SegmentedControl, Avatar, Button } from "@primer/react";

import styles from "./header.module.css";

export const AppHeader = () => {
  return (
    <Header className={styles.header}>
      <Header.Link href="#" fontSize={2} className={styles.headerLink}>
        <Octicon icon={MarkGithubIcon} size={32} className={styles.octicon} />
        Spark
      </Header.Link>
      <div className={styles.headerActions}>
        <SegmentedControl aria-label="View switcher">
          <SegmentedControl.IconButton selected aria-label="Browser view" icon={BrowserIcon} />
          <SegmentedControl.IconButton aria-label="Code view" icon={CodeIcon} />
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
