import { Box, Button, Text } from "@primer/react";
import styles from "./improvementsList.module.css";
import { Improvement } from "@/app/hooks/useImproveIssue";

interface ImprovementsListProps {
  improvements: Improvement[] | null;
  focusedImprovementIndex: number | null;
  handleImprovementClick: (index: number) => void;
  handleAcceptImprovement: (index: number) => void;
  handleDiscardImprovement: (index: number) => void;
}

export const ImprovementsList: React.FC<ImprovementsListProps> = ({
  improvements,
  focusedImprovementIndex,
  handleImprovementClick,
  handleAcceptImprovement,
  handleDiscardImprovement,
}) => {
  console.log(improvements);

  return (
    <Box className={styles.improvementsContainer}>
      <Box className={styles.improvementsList}>
        {improvements?.map((improvement, index) => (
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
    </Box>
  );
};
