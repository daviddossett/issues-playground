import { NavList, Box, Button } from "@primer/react";
import { SkeletonText } from "@primer/react/drafts";
import { useState } from "react";
import { Issue } from "../page";
import styles from "./navigation.module.css";

interface NavigationProps {
  setCurrentItem: (index: number) => void;
  issues: Issue[];
  loading: boolean;
  loadMoreIssues: () => void;
}

export const Navigation = ({
  setCurrentItem,
  issues,
  loading,
  loadMoreIssues,
}: NavigationProps) => {
  const [currentItem, setCurrentItemState] = useState(0);

  const handleItemClick = (index: number) => {
    setCurrentItemState(index);
    setCurrentItem(index);
  };

  const navItems = loading
    ? Array.from({ length: 10 }).map((_, index) => (
        <NavList.Item key={index}>
          <SkeletonText />
        </NavList.Item>
      ))
    : issues.map((issue, index) => (
        <NavList.Item
          key={issue.id}
          aria-current={index === currentItem ? "page" : undefined}
          onClick={() => handleItemClick(index)}
        >
          {issue.title}
        </NavList.Item>
      ));

  return (
    <Box className={styles.container}>
      <NavList.Group title={"Open Issues"}>
        <NavList>{navItems}</NavList>
      </NavList.Group>
      {!loading && (
        <Box className={styles.loadMoreButton}>
          <Button onClick={loadMoreIssues}>Load More</Button>
        </Box>
      )}
    </Box>
  );
};
