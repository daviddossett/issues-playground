import { Button, Header, Octicon } from "@primer/react";
import { MarkGithubIcon } from "@primer/octicons-react";
import { SkeletonText } from "@primer/react/drafts";
import styles from "./header.module.css";

interface AppHeaderProps {
  repoTitle: string;
  loading: boolean;
}

export const AppHeader = ({ repoTitle, loading }: AppHeaderProps) => {
  return (
    <Header className={styles.header}>
      <Header.Item full>
        <Header.Link href="#" fontSize={2} className={styles.headerLink}>
          <Octicon icon={MarkGithubIcon} size={32} className={styles.octicon} />
          {loading ? <SkeletonText size={"titleMedium"} /> : repoTitle}
        </Header.Link>
      </Header.Item>
      <Header.Item>
        <Button variant="primary">New issue</Button>
      </Header.Item>
    </Header>
  );
};
