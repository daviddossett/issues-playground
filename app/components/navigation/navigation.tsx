import { NavList, Box, Button, IconButton, Octicon, Text } from "@primer/react";
import { GitPullRequestIcon, SidebarExpandIcon, SyncIcon } from "@primer/octicons-react";
import { Blankslate, SkeletonText } from "@primer/react/drafts";
import { Issue } from "../../page";
import styles from "./navigation.module.css";
import { IssueOpenedIcon } from "@primer/octicons-react";

interface NavigationProps {
  currentItem: number;
  setCurrentItem: (index: number) => void;
  repo: string;
  issues: Issue[];
  loading: boolean;
  loadMoreIssues: () => void;
  hasMore: boolean;
}

const EmptyState = () => {
  return (
    <Box className={styles.emptyState}>
      <Blankslate narrow>
        <Blankslate.Heading>No issues</Blankslate.Heading>
        <Blankslate.Description>Create an issue to report a problem or share an idea</Blankslate.Description>
      </Blankslate>
    </Box>
  );
};

export const Navigation = ({
  currentItem,
  setCurrentItem,
  issues,
  loading,
  loadMoreIssues,
  hasMore,
}: NavigationProps) => {
  const LoadingNavItems = () => (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <NavList.Item key={index}>
          <SkeletonText maxWidth={`${Math.random() * (80 - 50) + 50}%`} />
        </NavList.Item>
      ))}
    </>
  );

  const LoadedNavItems = () => (
    <>
      {issues.map((issue, index) => {
        return (
          <NavList.Item
            key={issue.id}
            aria-current={currentItem === index}
            onClick={() => setCurrentItem(index)}
            className={styles.navItem}
          >
            <Box>
              <Box className={styles.navItemIssueMeta}>
                <Octicon
                  icon={issue.pull_request ? GitPullRequestIcon : IssueOpenedIcon}
                  size={14}
                  className={styles.navItemsIssueMetaIcon}
                />
                <Text as="span" className={styles.navItemsIssueMetaLabel}>{`#${issue.number}`}</Text>
              </Box>
              {issue.title}
            </Box>
          </NavList.Item>
        );
      })}
    </>
  );

  const navItems = loading ? <LoadingNavItems /> : issues.length > 0 ? <LoadedNavItems /> : <EmptyState />;

  return (
    <Box className={styles.container}>
      <Box className={styles.actionBar}>
        <IconButton icon={SidebarExpandIcon} aria-label="Hide sidebar" />
        <IconButton icon={SyncIcon} aria-label="Refresh" />
      </Box>
      <NavList className={styles.list}>{navItems}</NavList>
      {!loading && hasMore && (
        <Box className={styles.loadMoreButton}>
          <Button onClick={loadMoreIssues}>Load more</Button>
        </Box>
      )}
    </Box>
  );
};
