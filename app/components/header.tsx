import { Button, Header, Octicon } from "@primer/react";
import { MarkGithubIcon } from "@primer/octicons-react";
import { SkeletonText } from "@primer/react/drafts";

interface AppHeaderProps {
  repoTitle: string;
  loading: boolean;
}

export const AppHeader = ({ repoTitle, loading }: AppHeaderProps) => {
  const headerLinkStyles = {
    color: "fg.default",
    minWidth: "100px",
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
          {loading ? <SkeletonText size={"titleMedium"} /> : repoTitle}
        </Header.Link>
      </Header.Item>
      <Header.Item>
        <Button variant="primary">New Issue</Button>
      </Header.Item>
    </Header>
  );
};
