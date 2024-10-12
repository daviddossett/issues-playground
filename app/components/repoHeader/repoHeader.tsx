import { useState } from "react";
import { Box, Button, SelectPanel } from "@primer/react";
import { TriangleDownIcon } from "@primer/octicons-react";
import style from "./repoHeader.module.css";
import { ItemInput } from "@primer/react/lib-esm/deprecated/ActionList/List";

const items: ItemInput[] = [
  { text: "github/github", id: "1" },
  { text: "primer/react", id: "2" },
  { text: "microsoft/vscode", id: "3" },
];

const RepoSelector = () => {
  const [selected, setSelected] = useState<ItemInput | undefined>(items[0]);
  const [isOpen, setIsOpen] = useState(false);

  const [filter, setFilter] = useState("");
  const filteredItems = items.filter((item) => item?.text?.toLowerCase().includes(filter.toLowerCase()));

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <SelectPanel
      renderAnchor={({ children, "aria-labelledby": ariaLabelledBy, ...anchorProps }) => (
        <Button
          trailingAction={TriangleDownIcon}
          aria-labelledby={` ${ariaLabelledBy}`}
          {...anchorProps}
          onClick={() => setIsOpen(!isOpen)}
        >
          {children ?? "primer/react"}
        </Button>
      )}
      placeholderText="Pick a repo"
      open={isOpen}
      onOpenChange={handleOpenChange}
      items={filteredItems}
      overlayProps={{
        width: "medium",
        height: "xsmall",
      }}
      onFilterChange={setFilter}
      selected={selected}
      onSelectedChange={(selected: ItemInput | undefined) => setSelected(selected)}
    />
  );
};

export const RepoHeader = () => {
  return (
    <Box className={style.container}>
      <RepoSelector />
      <Button variant="primary">New issue</Button>
    </Box>
  );
};
