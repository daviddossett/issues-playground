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
  Octicon,
} from "@primer/react";
import { MarkGithubIcon } from "@primer/octicons-react";
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

const HeaderComponent = () => {
  const headerLinkStyles = {
    color: "fg.default",
    "&:hover, &:active, &:visited": {
      color: "fg.default",
      textDecoration: "underline",
    },
  };

  return (
    <Header
      sx={{
        backgroundColor: "transparent",
        borderBottom: "1px solid",
        borderColor: "border.default",
      }}
    >
      <Header.Item full>
        <Header.Link href="#" fontSize={2} sx={headerLinkStyles}>
          <Octicon
            icon={MarkGithubIcon}
            size={32}
            sx={{
              mr: 2,
            }}
          />
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
  );
};

const NavigationComponent = ({
  setCurrentItem,
}: {
  setCurrentItem: (index: number) => void;
}) => {
  const [currentItem, setCurrentItemState] = useState(0);

  const handleItemClick = (index: number) => {
    setCurrentItemState(index);
    setCurrentItem(index);
  };

  const navItems = Array.from({ length: 50 }, (_, index) => (
    <NavList.Item
      key={index}
      aria-current={index === currentItem ? "page" : undefined}
      onClick={() => handleItemClick(index)}
    >
      Nav Item {index + 1}
    </NavList.Item>
  ));

  const groupedNavItems = [];
  for (let i = 0; i < navItems.length; i += 10) {
    groupedNavItems.push(
      <NavList.Group title="Section" key={i}>
        {navItems.slice(i, i + 10)}
      </NavList.Group>
    );
  }

  return (
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
        height: "100%",
      }}
    >
      <NavList>{groupedNavItems}</NavList>
    </Box>
  );
};

const ContentComponent = ({ currentItem }: { currentItem: number }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        overflowY: "auto",
      }}
    >
      <NavItemContent index={currentItem} />
    </Box>
  );
};

export default function Home() {
  const [currentItem, setCurrentItem] = useState(0);

  return (
    <ThemeProvider colorMode="night">
      <BaseStyles>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
          }}
        >
          <HeaderComponent />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              maxWidth: "100%",
              flexGrow: 1,
              overflow: "hidden",
            }}
          >
            <NavigationComponent setCurrentItem={setCurrentItem} />
            <ContentComponent currentItem={currentItem} />
          </Box>
        </Box>
      </BaseStyles>
    </ThemeProvider>
  );
}
