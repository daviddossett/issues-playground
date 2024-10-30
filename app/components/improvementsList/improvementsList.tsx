import { Box, Button, Text } from "@primer/react";
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
  onOpenGuidelines: () => void; // New prop for opening guidelines
}

const LoadingImprovements = () => (
  <Box className={styles.improvementsList}>
    <SkeletonText lines={4} />
  </Box>
);

const EmptyState = ({
  onFetchImprovements,
  onOpenGuidelines,
}: {
  onFetchImprovements: () => void;
  onOpenGuidelines: () => void;
}) => (
  <Box className={styles.emptyState}>
    <Blankslate narrow>
      <Blankslate.Heading>No feedback</Blankslate.Heading>
      <Blankslate.Description>
        Copilot can give you feedback on your issue according to this guidelines in this repo
      </Blankslate.Description>
      <Box className={styles.emptyStateButtons}>
        <Button variant="primary" onClick={onFetchImprovements} className={styles.emptyStatePrimaryButton}>
          Generate feedback
        </Button>
        <Button onClick={onOpenGuidelines} className={styles.emptyStateSecondaryButton}>
          View guidelines
        </Button>
      </Box>
    </Blankslate>
  </Box>
);

export const ImprovementsList: React.FC<ImprovementsListProps> = ({
  improvements,
  focusedImprovementIndex,
  handleImprovementClick,
  handleAcceptImprovement,
  handleDiscardImprovement,
  loading,
  onFetchImprovements,
  onOpenGuidelines, // New prop for opening guidelines
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

  return (
    <Box className={styles.improvementsContainer}>
      {loading ? (
        <LoadingImprovements />
      ) : improvements && improvements.length > 0 ? (
        <Box className={styles.improvementsList}>
          {rewriteImprovement && (
            <>
              <Text className={styles.rewriteLabel}>Suggested Rewrite</Text>
              <Box
                ref={focusedImprovementIndex === improvements.indexOf(rewriteImprovement) ? focusedItemRef : null}
                className={`${styles.improvementItem} ${styles.rewriteItem} ${
                  focusedImprovementIndex === improvements.indexOf(rewriteImprovement)
                    ? styles.focusedImprovementItem
                    : ""
                }`}
                onClick={() => handleImprovementClick(improvements.indexOf(rewriteImprovement))}
                tabIndex={0}
                onFocus={() => handleImprovementClick(improvements.indexOf(rewriteImprovement))}
              >
                <Text as="p" className={styles.improvementItemOriginalText}>
                  {rewriteImprovement.original}
                </Text>
                <Text as="p" className={styles.improvementItemProposedText}>
                  {rewriteImprovement.proposed}
                </Text>
                <Box className={styles.improvementReasoning}>
                  <Text as="p" className={styles.improvementItemReasoningText}>
                    {rewriteImprovement.reasoning}
                  </Text>
                </Box>
                <Box className={styles.improvementItemButtons}>
                  <Box className={styles.improvementItemApplyDiscardButtons}>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptImprovement(improvements.indexOf(rewriteImprovement));
                      }}
                    >
                      Apply Rewrite
                    </Button>
                    <Button
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDiscardImprovement(improvements.indexOf(rewriteImprovement));
                      }}
                    >
                      Discard
                    </Button>
                  </Box>
                  <Button variant="invisible">Refine</Button>
                </Box>
              </Box>
            </>
          )}

          {discreteImprovements && discreteImprovements.length > 0 && (
            <>
              <Text className={styles.discreteLabel}>Specific Improvements</Text>
              {discreteImprovements.map((improvement) => {
                const actualIndex = improvements.indexOf(improvement);
                return (
                  <Box
                    key={actualIndex}
                    ref={focusedImprovementIndex === actualIndex ? focusedItemRef : null}
                    className={`${styles.improvementItem} ${
                      focusedImprovementIndex === actualIndex ? styles.focusedImprovementItem : ""
                    }`}
                    onClick={() => handleImprovementClick(actualIndex)}
                    tabIndex={0}
                    onFocus={() => handleImprovementClick(actualIndex)}
                  >
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptImprovement(actualIndex);
                          }}
                        >
                          Apply
                        </Button>
                        <Button
                          variant="danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDiscardImprovement(actualIndex);
                          }}
                        >
                          Discard
                        </Button>
                      </Box>
                      <Button variant="invisible">Refine</Button>
                    </Box>
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
