import { Box, Button, Text } from "@primer/react";
import { CopilotIcon } from "@primer/octicons-react";
import { SkeletonText, Blankslate } from "@primer/react/drafts";
import { Improvement } from "@/app/hooks/useImproveIssue";
import styles from "./improvementsList.module.css";
import { useEffect, useRef } from "react";

interface ImprovementsListProps {
  improvements: Improvement[] | null;
  focusedImprovementIndex: number | null;
  handleImprovementClick: (index: number) => void;
  handleAcceptImprovement: (index: number) => void;
  handleDiscardImprovement: (index: number) => void;
  loading: boolean;
  onFetchImprovements: () => void;
  onOpenGuidelines: () => void;
  isRefreshingAfterRewrite?: boolean;
}

const LoadingState = () => (
  <Box className={styles.improvementsList}>
    <Text className={styles.sectionLabel}>Rewrite</Text>
    <Box className={styles.improvementItem}>
      <ImprovementSkeleton />
    </Box>
    <Text className={styles.sectionLabel}>Refine</Text>
    <Box className={styles.improvementItem}>
      <ImprovementSkeleton />
    </Box>
    <Box className={styles.improvementItem}>
      <ImprovementSkeleton />
    </Box>
  </Box>
);

const EmptyState = ({ onFetchImprovements }: { onFetchImprovements: () => void; onOpenGuidelines: () => void }) => (
  <Box className={styles.emptyState}>
    <Blankslate narrow>
      <Blankslate.Heading>No feedback</Blankslate.Heading>
      <Blankslate.Description>
        Copilot helps you create actionable issues according to the{" "}
        <a href="https://github.com/daviddossett/grid-playground/blob/main/.github/issue-guidelines.md" target="_blank">
          guidelines
        </a>{" "}
        in this daviddossett/grid-playground.
      </Blankslate.Description>
      <Box className={styles.emptyStateButtons}>
        <Button onClick={onFetchImprovements} className={styles.emptyStatePrimaryButton} leadingVisual={CopilotIcon}>
          Generate feedback
        </Button>
      </Box>
    </Blankslate>
  </Box>
);

const ImprovementSkeleton = () => (
  <>
    <Text as="p" className={styles.improvementItemOriginalText}>
      <SkeletonText />
    </Text>
    <Text as="p" className={styles.improvementItemProposedText}>
      <SkeletonText />
    </Text>
    <Box className={styles.improvementReasoning}>
      <Text as="p" className={styles.improvementItemReasoningText}>
        <SkeletonText />
      </Text>
    </Box>
  </>
);

export const ImprovementsList: React.FC<ImprovementsListProps> = ({
  improvements,
  focusedImprovementIndex,
  handleImprovementClick,
  handleAcceptImprovement,
  handleDiscardImprovement,
  loading,
  onFetchImprovements,
  onOpenGuidelines,
  isRefreshingAfterRewrite = false,
}) => {
  const focusedItemRef = useRef<HTMLDivElement>(null);

  const rewriteImprovement = improvements?.find((imp) => imp.type === "rewrite");
  const discreteImprovements = improvements?.filter((imp) => imp.type === "discrete");

  // Remove the first useEffect that was trying to set initial focus
  // Instead, rely on the parent component to set the initial focus

  // Simplified focus effect
  useEffect(() => {
    if (focusedImprovementIndex !== null && focusedItemRef.current) {
      focusedItemRef.current.focus();
      // Ensure the element is visible
      focusedItemRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [focusedImprovementIndex, improvements]);

  const renderImprovementContent = (improvement: Improvement, actualIndex: number) => {
    if (isRefreshingAfterRewrite) {
      return <ImprovementSkeleton />;
    }

    return (
      <>
        <Text as="p" className={styles.improvementItemOriginalText}>
          {improvement.original}
        </Text>
        <Text as="p" className={styles.improvementItemProposedText}>
          {improvement.proposed || "[Suggest to remove this based on issue guidelines]"}
        </Text>
        <Box className={styles.improvementReasoning}>
          <Text as="p" className={styles.improvementItemReasoningText}>
            {improvement.reasoning}
          </Text>
        </Box>
        <Box className={styles.improvementItemButtons}>
          <Box className={styles.improvementItemApplyDiscardButtons}>
            <Button
              disabled={isRefreshingAfterRewrite}
              onClick={(e) => {
                e.stopPropagation();
                handleAcceptImprovement(actualIndex);
              }}
            >
              Apply
            </Button>
            <Button
              disabled={isRefreshingAfterRewrite}
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                handleDiscardImprovement(actualIndex);
              }}
            >
              Discard
            </Button>
          </Box>
          <Button disabled={isRefreshingAfterRewrite} variant="invisible">
            Refine
          </Button>
        </Box>
      </>
    );
  };

  return (
    <Box className={styles.improvementsContainer}>
      {loading && !isRefreshingAfterRewrite ? (
        <LoadingState />
      ) : improvements && improvements.length > 0 ? (
        <Box className={styles.improvementsList}>
          {rewriteImprovement && (
            <>
              <Text className={styles.sectionLabel}>Rewrite</Text>
              <Box
                ref={focusedImprovementIndex === improvements.indexOf(rewriteImprovement) ? focusedItemRef : null}
                className={`${styles.improvementItem} ${
                  focusedImprovementIndex === improvements.indexOf(rewriteImprovement)
                    ? styles.focusedImprovementItem
                    : ""
                }`}
                onClick={() =>
                  !isRefreshingAfterRewrite && handleImprovementClick(improvements.indexOf(rewriteImprovement))
                }
                tabIndex={isRefreshingAfterRewrite ? -1 : 0}
                onFocus={() => handleImprovementClick(improvements.indexOf(rewriteImprovement))}
              >
                {renderImprovementContent(rewriteImprovement, improvements.indexOf(rewriteImprovement))}
              </Box>
            </>
          )}

          {discreteImprovements && discreteImprovements.length > 0 && (
            <>
              <Text className={styles.sectionLabel}>Refine</Text>
              {discreteImprovements.map((improvement) => {
                const actualIndex = improvements.indexOf(improvement);
                return (
                  <Box
                    key={actualIndex}
                    ref={focusedImprovementIndex === actualIndex ? focusedItemRef : null}
                    className={`${styles.improvementItem} ${
                      focusedImprovementIndex === actualIndex ? styles.focusedImprovementItem : ""
                    }`}
                    onClick={() => !isRefreshingAfterRewrite && handleImprovementClick(actualIndex)}
                    tabIndex={isRefreshingAfterRewrite ? -1 : 0}
                    onFocus={() => handleImprovementClick(actualIndex)}
                  >
                    {renderImprovementContent(improvement, actualIndex)}
                  </Box>
                );
              })}
            </>
          )}
        </Box>
      ) : (
        <EmptyState onFetchImprovements={onFetchImprovements} onOpenGuidelines={onOpenGuidelines} />
      )}
    </Box>
  );
};
