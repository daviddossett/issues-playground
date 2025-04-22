"use client";

import { ThemeProvider, BaseStyles, Box } from "@primer/react";
import { useState } from "react";
import { AppHeader } from "./components/header/header";
import { SidePanel } from "./components/SidePanel/SidePanel";
import { MainContent } from "./components/MainContent/MainContent";
import styles from "./page.module.css";

export default function Home() {
  const [isPanelVisible, setisPanelVisible] = useState<boolean>(true);
  const [isNavVisible, setIsNavVisible] = useState<boolean>(true);
  const [isIterating, setIsIterating] = useState<boolean>(false);

  const toggleNavVisibility = () => {
    setIsNavVisible(!isNavVisible);
  };

  return (
    <ThemeProvider colorMode="auto" preventSSRMismatch>
      <BaseStyles>
        <Box className={styles.container}>
          <AppHeader />
          <Box className={styles.innerContainer}>
            <Box className={styles.mainContent}>
              {isNavVisible && (
                <SidePanel 
                  toggleNavVisibility={toggleNavVisibility}
                  isIterating={isIterating}
                  setIsIterating={setIsIterating}
                />
              )}
              <MainContent
                isNavVisible={isNavVisible}
                toggleNavVisibility={toggleNavVisibility}
                isIterating={isIterating}
                setIsIterating={setIsIterating}
              />
            </Box>
          </Box>
        </Box>
      </BaseStyles>
    </ThemeProvider>
  );
}
