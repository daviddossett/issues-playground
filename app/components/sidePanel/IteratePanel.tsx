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
  isIterating: boolean;
  setIsIterating: (isIterating: boolean) => void;
}

// Pool of possible suggestions
const SUGGESTION_POOL = [
  "Add flight price tracking and alerts for recommended destinations",
  "Include local food and cuisine recommendations for each day",
  "Add weather forecast integration for trip dates",
  "Create a packing list generator based on destination and activities",
  "Add virtual tours of hotels and landmarks",
  "Include local transportation options and booking",
  "Create a trip budget calculator with expense tracking",
  "Add local events and festivals to itinerary suggestions",
  "Include restaurant reservations in the itinerary",
  "Add travel insurance recommendations",
  "Create a photo gallery for each destination",
  "Add user reviews and ratings for destinations",
  "Include local customs and etiquette tips",
  "Add emergency contact information for destinations",
  "Create a currency converter with live rates",
  "Add language translation tools for travelers",
  "Include visa and passport requirement checks",
  "Add nearby attraction suggestions for each day",
  "Create a shareable travel plan for group trips",
  "Add local guide and tour booking options",
];

// Helper function to get random suggestions
const getRandomSuggestions = (count: number) => {
  const shuffled = [...SUGGESTION_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((text, index) => ({
    id: index.toString(),
    text,
    icon: LightBulbIcon,
  }));
};

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

export const IteratePanel = ({ onVersionSelect, isIterating, setIsIterating }: IteratePanelProps) => {
  const [prompt, setPrompt] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState<Array<{ id: string; text: string; icon: typeof LightBulbIcon }>>([]);

  // Simulate API call to fetch suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 second delay
      setSuggestions(getRandomSuggestions(3)); // Get 3 random suggestions
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [versions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isIterating) return;

    console.log('Submitting new version...');
    const newVersion: Version = {
      id: Date.now().toString(),
      prompt: prompt.trim(),
      timestamp: new Date(),
    };

    setVersions([...versions, newVersion]);
    setPrompt("");
    setSelectedVersionId(newVersion.id);
    onVersionSelect(newVersion);
    setIsIterating(true);
    console.log('Set isIterating to true');

    // Auto-reset after 5-10 seconds
    const loadingDuration = Math.floor(Math.random() * 5000) + 5000;
    console.log('Setting timeout for', loadingDuration, 'ms');
    setTimeout(() => {
      console.log('Resetting isIterating to false');
      setIsIterating(false);
    }, loadingDuration);
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

  useEffect(() => {
    const updateTimelineHeight = () => {
      const items = document.querySelectorAll(`.${styles.activityItem}`);
      const container = document.querySelector(`.${styles.activityLogContainer}`) as HTMLElement;

      if (items.length > 0 && container) {
        const lastItem = items[items.length - 1] as HTMLElement;

        if (lastItem.classList.contains(styles.activityItemActive)) {
          // Calculate the bottom position as 50% of the active item's height
          const bottomOffset = lastItem.offsetHeight * 0.5 + 16;
          container.style.setProperty("--timeline-bottom", `${bottomOffset}px`);
        } else {
          container.style.setProperty("--timeline-bottom", `32px`); // Default value
        }
      }
    };

    updateTimelineHeight();

    // Update on scroll
    const scrollElement = scrollRef.current;
    scrollElement?.addEventListener("scroll", updateTimelineHeight);

    return () => {
      scrollElement?.removeEventListener("scroll", updateTimelineHeight);
    };
  }, [selectedVersionId]);

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
                {selectedVersionId === version.id && isIterating && (
                  <div className={styles.thinkingCaption}>Thinking...</div>
                )}
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
                        setIsIterating(true);

                        // Auto-reset after 5-10 seconds
                        const loadingDuration = Math.floor(Math.random() * 5000) + 5000;
                        setTimeout(() => {
                          setIsIterating(false);
                        }, loadingDuration);

                        // Show loading state and regenerate suggestions
                        setIsLoadingSuggestions(true);
                        await new Promise((resolve) => setTimeout(resolve, 3000));
                        setSuggestions(getRandomSuggestions(3));
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
