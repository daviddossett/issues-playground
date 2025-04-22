"use client";

import { ThemeProvider, BaseStyles, Box } from "@primer/react";
import { useState, useEffect } from "react";
import { AppHeader } from "./components/header/header";
import { SidePanel } from "./components/SidePanel/SidePanel";
import { MainContent } from "./components/MainContent/MainContent";
import { CodeView } from "./components/CodeView/CodeView";
import clsx from "clsx";
import styles from "./page.module.css";

type ViewMode = "preview" | "code" | "split";

export default function Home() {
  const [isPanelVisible, setisPanelVisible] = useState<boolean>(true);
  const [isNavVisible, setIsNavVisible] = useState<boolean>(true);
  const [isIterating, setIsIterating] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>("preview");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIterating(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const toggleNavVisibility = () => {
    setIsNavVisible(!isNavVisible);
  };

  const renderViews = () => {
    const viewContainerClass = clsx(styles.viewContainer, {
      [styles.splitView]: viewMode === "split",
      [styles.previewOnly]: viewMode === "preview",
      [styles.codeOnly]: viewMode === "code",
    });

    return (
      <div className={viewContainerClass}>
        <div className={clsx(styles.view, {
          [styles.viewVisible]: viewMode === "code" || viewMode === "split"
        })}>
          <CodeView
            isNavVisible={isNavVisible}
            toggleNavVisibility={toggleNavVisibility}
            viewMode={viewMode}
            isIterating={isIterating}
          />
        </div>
        <div className={clsx(styles.view, {
          [styles.viewVisible]: viewMode === "preview" || viewMode === "split"
        })}>
          <MainContent
            isNavVisible={isNavVisible}
            toggleNavVisibility={toggleNavVisibility}
            isIterating={isIterating}
            setIsIterating={setIsIterating}
            viewMode={viewMode}
          />
        </div>
      </div>
    );
  };

  return (
    <ThemeProvider colorMode="auto" preventSSRMismatch>
      <BaseStyles>
        <Box className={styles.container}>
          <AppHeader viewMode={viewMode} onViewModeChange={setViewMode} />
          <Box className={styles.innerContainer}>
            <Box className={styles.mainContent}>
              {isNavVisible && (
                <SidePanel
                  toggleNavVisibility={toggleNavVisibility}
                  isIterating={isIterating}
                  setIsIterating={setIsIterating}
                />
              )}
              {renderViews()}
            </Box>
          </Box>
        </Box>
      </BaseStyles>
    </ThemeProvider>
  );
}
