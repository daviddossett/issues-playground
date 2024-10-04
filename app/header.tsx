import { Header, Octicon } from "@primer/react";
import { MarkGithubIcon } from "@primer/octicons-react";

export const AppHeader = () => {
  const title = "Issues";
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
          {title}
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
