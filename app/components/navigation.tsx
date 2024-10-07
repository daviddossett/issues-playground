import { NavList, Box } from "@primer/react";
import { SkeletonText } from "@primer/react/drafts";
import { useState } from "react";
import { Issue } from "../page";

interface NavigationProps {
  setCurrentItem: (index: number) => void;
  issues: Issue[];
  loading: boolean;
}

export const Navigation = ({
  setCurrentItem,
  issues,
  loading,
}: NavigationProps) => {
  const [currentItem, setCurrentItemState] = useState(0);

  const handleItemClick = (index: number) => {
    setCurrentItemState(index);
    setCurrentItem(index);
  };

  const navItems = issues.map((issue, index) => (
    <NavList.Item
      key={issue.id}
      aria-current={index === currentItem ? "page" : undefined}
      onClick={() => handleItemClick(index)}
    >
      {loading ? <SkeletonText /> : issue.title}
    </NavList.Item>
  ));

  return (
    <Box
      sx={{
        maxWidth: "320px",
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: "320px",
        borderRight: "1px solid",
        borderColor: "border.default",
        paddingX: 2,
        overflowY: "auto",
        height: "100%",
      }}
    >
      <NavList.Group title={"Issues"}>
        <NavList>{navItems}</NavList>
      </NavList.Group>
    </Box>
  );
};
