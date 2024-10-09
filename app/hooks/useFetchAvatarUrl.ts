import { useState, useEffect } from "react";
import { fetchAvatarUrl } from "../client";
import { Issue } from "../page";

export const useFetchAvatarUrl = (issue: Issue) => {
  const [avatarUrls, setAvatarUrls] = useState<{ [key: string]: string }>({});
  const [avatarLoading, setAvatarLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (issue?.user && !avatarUrls[issue.user.login]) {
        setAvatarLoading(true);
        try {
          const url = await fetchAvatarUrl(issue.user.login);
          if (issue?.user) {
            setAvatarUrls((prev) => ({
              ...prev,
              [issue?.user?.login ?? ""]: url,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch avatar URL:", error);
        } finally {
          setAvatarLoading(false);
        }
      } else {
        setAvatarLoading(false);
      }
    };

    fetchAvatar();
  }, [issue, avatarUrls]);

  return { avatarUrls, avatarLoading };
};
