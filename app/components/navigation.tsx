import { NavList, Box } from "@primer/react";
import { useState, useEffect } from "react";
import { getIssueSummary } from "../api/openai";
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
      const summaries = await Promise.all(
        issues.map(async (issue) => {
          const summary = await getIssueSummary(issue.body ?? "");
          return summary;
        })
      );
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
      {summaries[index] || "Loading..."}
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
