import { NavList, Box } from "@primer/react";
import { SkeletonText } from "@primer/react/drafts";
import { useState, useEffect } from "react";
import { Issue } from "../page";

export const Navigation = ({
  setCurrentItem,
  issues,
}: {
  setCurrentItem: (index: number) => void;
  issues: Issue[];
}) => {
  const [currentItem, setCurrentItemState] = useState(0);
  const [summaries, setSummaries] = useState<string[]>([]);

  useEffect(() => {
    const fetchSummaries = async () => {
      const summaries = issues.map((issue) => issue.title);
      setSummaries(summaries);
    };

    fetchSummaries();
  }, [issues]);

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
      {summaries[index] || <SkeletonText />}
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
