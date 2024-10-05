import { Button, Header, Octicon } from "@primer/react";
import { MarkGithubIcon } from "@primer/octicons-react";

interface AppHeaderProps {
  repoTitle: string;
}

export const AppHeader = ({ repoTitle }: AppHeaderProps) => {
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
              mr: "12px",
            }}
          />
          {repoTitle}
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
      <Header.Item>
        <Button variant="primary">New Issue</Button>
      </Header.Item>
    </Header>
  );
};
