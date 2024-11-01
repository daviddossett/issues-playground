import { NavList, Box, Button, IconButton, Octicon, Text } from "@primer/react";
import { GitPullRequestIcon, SidebarExpandIcon, SyncIcon } from "@primer/octicons-react";
import { Blankslate, SkeletonText } from "@primer/react/drafts";
import { Issue } from "../../page";
import styles from "./navigation.module.css";
import { IssueOpenedIcon } from "@primer/octicons-react";
import { useRef, useEffect } from "react";

interface NavigationProps {
  currentIssue: number;
  onSetCurrentIssue: (index: number) => void;
  issues: Issue[];
  loading: boolean;
  toggleNavVisibility: () => void;
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
  currentIssue,
  onSetCurrentIssue,
  issues,
  loading,
  toggleNavVisibility,
}: NavigationProps) => {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const currentIssueRef = itemRefs.current[currentIssue];
    if (currentIssueRef) {
      const { top, bottom } = currentIssueRef.getBoundingClientRect();
      const { innerHeight } = window;
      if (top < 0 || bottom > innerHeight) {
        currentIssueRef.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [currentIssue]);

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
            aria-current={currentIssue === index}
            onClick={() => onSetCurrentIssue(index)}
            className={styles.navItem}
            ref={(el) => {
              itemRefs.current[index] = el as HTMLLIElement | null;
            }}
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
        <IconButton icon={SidebarExpandIcon} aria-label="Hide nav" onClick={toggleNavVisibility} />
        <IconButton icon={SyncIcon} aria-label="Refresh" />
      </Box>
      <NavList className={styles.list}>
        {navItems}
      </NavList>
    </Box>
  );
};
