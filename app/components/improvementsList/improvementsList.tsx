import { Box, Button, Text } from "@primer/react";
import { SkeletonText, Blankslate } from "@primer/react/drafts";
import { Improvement } from "@/app/hooks/useImproveIssue";
import styles from "./improvementsList.module.css";

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
  return (
    <Box className={styles.improvementsContainer}>
      {loading ? (
        <LoadingImprovements />
      ) : improvements && improvements.length > 0 ? (
        <Box className={styles.improvementsList}>
          {improvements.map((improvement, index) => (
            <Box
              key={index}
              className={`${styles.improvementItem} ${focusedImprovementIndex === index ? styles.focusedImprovementItem : ""}`}
              onClick={() => handleImprovementClick(index)}
              tabIndex={0}
              onFocus={() => handleImprovementClick(index)}
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
                      handleAcceptImprovement(index);
                    }}
                  >
                    Apply
                  </Button>
                  <Button
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDiscardImprovement(index);
                    }}
                  >
                    Discard
                  </Button>
                </Box>
                <Button variant="invisible">Refine</Button>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <EmptyState onFetchImprovements={onFetchImprovements} onOpenGuidelines={onOpenGuidelines} />
      )}
    </Box>
  );
};
