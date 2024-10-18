import { NavList, Box, Button, IconButton } from "@primer/react";
import { SidebarExpandIcon, SyncIcon } from "@primer/octicons-react";
import { SkeletonText } from "@primer/react/drafts";
import { useState } from "react";
import { Issue } from "../../page";
import styles from "./navigation.module.css";

interface NavigationProps {
  setCurrentItem: (index: number) => void;
  issues: Issue[];
  loading: boolean;
  loadMoreIssues: () => void;
  hasMore: boolean; // Add this line
}

export const Navigation = ({ setCurrentItem, issues, loading, loadMoreIssues, hasMore }: NavigationProps) => {
  const [currentItem, setCurrentItemState] = useState(0);

  const handleItemClick = (index: number) => {
    setCurrentItemState(index);
    setCurrentItem(index);
  };

  const LoadingNavItems = () => (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <NavList.Item key={index}>
          <SkeletonText maxWidth={`${Math.random() * (80 - 50) + 50}%`} />
        </NavList.Item>
      ))}
    </>
  );

  const LoadedNavItems = () => (
    <>
      {issues.map((issue, index) => {
        const isSelected = index === currentItem;
        return (
          <NavList.Item
            key={issue.id}
            aria-current={isSelected ? "page" : undefined}
            onClick={() => handleItemClick(index)}
            className={styles.navItem}
          >
            {issue.title}
          </NavList.Item>
        );
      })}
    </>
  );

  const navItems = loading ? <LoadingNavItems /> : <LoadedNavItems />;

  return (
    <Box className={styles.container}>
      <Box className={styles.actionBar}>
        <IconButton icon={SidebarExpandIcon} aria-label="Hide sidebar" />
        <IconButton icon={SyncIcon} aria-label="Refresh" />
      </Box>
      <NavList className={styles.list}>{navItems}</NavList>
      {!loading &&
        hasMore && ( // Conditionally render the button
          <Box className={styles.loadMoreButton}>
            <Button onClick={loadMoreIssues}>Load More</Button>
          </Box>
        )}
    </Box>
  );
};
