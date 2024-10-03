"use client";

import {
  ThemeProvider,
  BaseStyles,
  Button,
  Box,
  NavList,
  Text,
  Heading,
  Label,
  Avatar,
  CounterLabel,
  Header,
} from "@primer/react";
import { useState, useEffect } from "react";

const getRandomComponents = () => {
  const components = [
    <Text key="text">This is a random text component.</Text>,
    <Button key="button" variant="primary">
      Random Button
    </Button>,
    <Heading key="heading">Random Heading</Heading>,
    <Label key="label" variant="success">
      Random Label
    </Label>,
    <Avatar key="avatar" src="https://github.com/github.png" size={40} />,
    <CounterLabel key="counter" scheme="primary">
      42
    </CounterLabel>,
  ];

  return components.sort(() => 0.5 - Math.random()).slice(0, 3);
};

const NavItemContent = ({ index }: { index: number }) => {
  const [randomComponents, setRandomComponents] = useState<JSX.Element[]>([]);

  useEffect(() => {
    setRandomComponents(getRandomComponents());
  }, [index]);

  return (
    <Box>
      <Text as="h2">Content for Nav Item {index + 1}</Text>
      {randomComponents}
    </Box>
  );
};

export default function Home() {
  const [currentItem, setCurrentItem] = useState(0);

  const navItems = Array.from({ length: 50 }, (_, index) => (
    <NavList.Item
      key={index}
      aria-current={index === currentItem ? "page" : undefined}
      onClick={() => setCurrentItem(index)}
    >
      Nav Item {index + 1}
    </NavList.Item>
  ));

  const headerLinkStyles = {
    color: "fg.default",
    "&:hover, &:active, &:visited": {
      color: "fg.default",
      textDecoration: "underline",
    },
  };

  return (
    <ThemeProvider colorMode="night">
      <BaseStyles>
        <Header
          sx={{
            backgroundColor: "transparent",
            borderBottom: "1px solid",
            borderColor: "border.default",
          }}
        >
          <Header.Item full>
            <Header.Link href="#" fontSize={2} sx={headerLinkStyles}>
              Header
            </Header.Link>
          </Header.Item>
          <Header.Item sx={{ marginLeft: 3 }}>
            <Header.Link href="#" fontSize={2} sx={headerLinkStyles}>
              Link 1
            </Header.Link>
          </Header.Item>
          <Header.Item sx={{ marginLeft: 3 }}>
            <Header.Link href="#" fontSize={2} sx={headerLinkStyles}>
              Link 2
            </Header.Link>
          </Header.Item>
        </Header>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            maxWidth: "100%",
          }}
        >
          <Box
            sx={{
              maxWidth: "300px",
              flexGrow: 0,
              flexShrink: 0,
              flexBasis: "300px",
              borderRight: "1px solid",
              borderColor: "border.default",
              paddingX: 2,
              overflowY: "auto",
              height: "100vh",
            }}
          >
            <NavList>{navItems}</NavList>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <NavItemContent index={currentItem} />
          </Box>
        </Box>
      </BaseStyles>
    </ThemeProvider>
  );
}
