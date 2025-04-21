import { Box, IconButton } from "@primer/react";
import {
  SidebarExpandIcon,
  DatabaseIcon,
  GearIcon,
  HistoryIcon,
  ImageIcon,
  SparkleFillIcon,
  AiModelIcon,
} from "@primer/octicons-react";
import { useState } from "react";
import clsx from "clsx";

import styles from "./navigation.module.css";

const PANELS = [
  { type: "iterate", label: "Iterate", icon: SparkleFillIcon },
  { type: "ai", label: "AI", icon: AiModelIcon },
  { type: "data", label: "Data", icon: DatabaseIcon },
  { type: "assets", label: "Assets", icon: ImageIcon },
] as const;

type PanelType = (typeof PANELS)[number]["type"];

interface NavigationProps {
  toggleNavVisibility: () => void;
}

export const Navigation = ({ toggleNavVisibility }: NavigationProps) => {
  const [selectedPanel, setSelectedPanel] = useState<PanelType>("iterate");

  return (
    <Box className={styles.container}>
      <Box className={styles.nav}>
        <Box className={styles.navList}>
          {PANELS.map((panel) => {
            const Icon = panel.icon;
            return (
              <button
                type="button"
                key={panel.type}
                className={clsx(styles.navButton, {
                  [styles.navButtonActive]: selectedPanel === panel.type,
                })}
                onClick={() => setSelectedPanel(panel.type)}
              >
                <Icon />
                <span className={styles.navButtonLabel}>{panel.label}</span>
              </button>
            );
          })}
        </Box>

        <IconButton
          variant="invisible"
          icon={SidebarExpandIcon}
          size="medium"
          aria-label="Collapse panel"
          tooltipDirection="e"
          onClick={toggleNavVisibility}
        />
      </Box>
      <Box className={styles.panel}>
        {/* Panel content will go here */}
        {selectedPanel === "iterate" && <div>Iterate Panel</div>}
        {selectedPanel === "ai" && <div>AI Panel</div>}
        {selectedPanel === "data" && <div>Data Panel</div>}
        {selectedPanel === "assets" && <div>Assets Panel</div>}
      </Box>
    </Box>
  );
};
