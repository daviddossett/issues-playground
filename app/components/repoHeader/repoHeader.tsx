import React from "react";
import { Box, Button, SelectPanel } from "@primer/react";
import { TriangleDownIcon } from "@primer/octicons-react";
import style from "./repoHeader.module.css";
import { ItemInput } from "@primer/react/lib-esm/deprecated/ActionList/List";

const items: ItemInput[] = [
  { text: "boop", id: "1" },
  { text: "bop", id: "2" },
  { text: "beep", id: "3" },
];

const RepoSelector = () => {
  const [selected, setSelected] = React.useState<ItemInput[]>([]);

  return (
    <SelectPanel
      renderAnchor={({ children, "aria-labelledby": ariaLabelledBy, ...anchorProps }) => (
        <Button trailingAction={TriangleDownIcon} aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
          {children ?? "Select a repo"}
        </Button>
      )}
      placeholderText="Filter Labels"
      open={false}
      onOpenChange={() => {}}
      items={items}
      showItemDividers={true}
      overlayProps={{
        width: "small",
        height: "xsmall",
      }}
      onFilterChange={() => {}}
      selected={selected}
      onSelectedChange={setSelected}
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
