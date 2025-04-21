import { useState, useRef, useEffect } from "react";
import styles from "./IteratePanel.module.css";
import { IconButton, ActionList, Box } from "@primer/react";
import {
  PaperclipIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  LightBulbIcon,
  ChevronRightIcon,
} from "@primer/octicons-react";

interface Version {
  id: string;
  prompt: string;
  timestamp: Date;
}

interface IteratePanelProps {
  onVersionSelect: (version: Version) => void;
}

// Example suggestions
const SUGGESTIONS = [
  {
    id: "1",
    text: "Add a profile screen with visit stats and badges",
    icon: LightBulbIcon,
  },
  {
    id: "2",
    text: "Create a dark mode toggle",
    icon: LightBulbIcon,
  },
  {
    id: "3",
    text: "Add keyboard shortcuts",
    icon: LightBulbIcon,
  },
];

const SuggestionSkeleton = () => (
  <ActionList>
    {[1, 2, 3].map((i) => (
      <ActionList.Item disabled key={i}>
        <div
          className={styles.skeletonText}
          style={{ width: `${50 + i * 10}%` }} // Varying widths for skeleton items
        />
      </ActionList.Item>
    ))}
  </ActionList>
);

export const IteratePanel = ({ onVersionSelect }: IteratePanelProps) => {
  const [prompt, setPrompt] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState<typeof SUGGESTIONS>([]);

  // Simulate API call to fetch suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 second delay
      setSuggestions(SUGGESTIONS);
      setIsLoadingSuggestions(false);
    };
    loadSuggestions();
  }, []);
  const initialVersion: Version = {
    id: "initial",
    prompt:
      "Create an AI-powered vacation planner app that helps users find their perfect getaway. Include:\n- Preference inputs for climate, budget, activity level, and trip duration\n- AI-generated destination recommendations with images and details\n- Personalized itinerary generation\n- Loading states with step-by-step updates\n- Clean, modern UI with cards and intuitive navigation",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  };

  const [versions, setVersions] = useState<Version[]>([initialVersion]);
  const [selectedVersionId, setSelectedVersionId] = useState<string>(initialVersion.id);
  const scrollRef = useRef<HTMLDivElement>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const newVersion: Version = {
      id: Date.now().toString(),
      prompt: prompt.trim(),
      timestamp: new Date(),
    };

    setVersions([...versions, newVersion]);
    setPrompt("");
    setSelectedVersionId(newVersion.id);
    onVersionSelect(newVersion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVersionClick = (version: Version) => {
    setSelectedVersionId(version.id);
    onVersionSelect(version);
  };

  const resizeTextarea = () => {
    if (promptInputRef.current) {
      promptInputRef.current.style.height = "auto";
      promptInputRef.current.style.height = promptInputRef.current.scrollHeight + "px";
    }
  };

  return (
    <div className={styles.container}>
      <div ref={scrollRef} className={styles.contentArea}>
        <div className={styles.activityLogContainer}>
          {versions.map((version) => (
            <button
              key={version.id}
              className={`${styles.activityItem} ${selectedVersionId === version.id ? styles.activityItemActive : ""}`}
              onClick={() => handleVersionClick(version)}
            >
              <div
                className={`${styles.refinement} ${selectedVersionId === version.id ? styles.refinementActive : ""}`}
              >
                {version.prompt}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.inputGroup}>
        <Box className={styles.suggestionsContainer}>
          <div className={styles.suggestionsHeader}>
            <IconButton
              size="small"
              icon={isSuggestionsOpen ? ChevronDownIcon : ChevronRightIcon}
              onClick={() => setIsSuggestionsOpen(!isSuggestionsOpen)}
              className={styles.suggestionsToggle}
              aria-label="Toggle suggestions"
              variant="invisible"
            />
            <span className={styles.suggestionsLabel}>Suggestions</span>
          </div>
          {isSuggestionsOpen && (
            <>
              {isLoadingSuggestions ? (
                <SuggestionSkeleton />
              ) : (
                <ActionList className={styles.suggestionsList}>
                  {suggestions.map((suggestion) => (
                    <ActionList.Item
                      key={suggestion.id}
                      onSelect={async () => {
                        const newVersion: Version = {
                          id: Date.now().toString(),
                          prompt: suggestion.text,
                          timestamp: new Date(),
                        };
                        setVersions([...versions, newVersion]);
                        setSelectedVersionId(newVersion.id);
                        onVersionSelect(newVersion);

                        // Show loading state and regenerate suggestions
                        setIsLoadingSuggestions(true);
                        await new Promise((resolve) => setTimeout(resolve, 3000));
                        setSuggestions(SUGGESTIONS);
                        setIsLoadingSuggestions(false);
                      }}
                    >
                      <ActionList.LeadingVisual>
                        <LightBulbIcon className={styles.suggestionIcon} />
                      </ActionList.LeadingVisual>
                      {suggestion.text}
                    </ActionList.Item>
                  ))}
                </ActionList>
              )}
            </>
          )}
        </Box>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <textarea
              ref={promptInputRef}
              className={styles.textarea}
              rows={1}
              placeholder="What would you like to change?"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                resizeTextarea();
              }}
              onKeyDown={handleKeyDown}
            />
            <div className={styles.inputActions}>
              <IconButton aria-label="Add attachment" icon={PaperclipIcon} variant="invisible" />
              <IconButton aria-label="Send now" icon={PaperAirplaneIcon} variant="invisible" type="submit" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
