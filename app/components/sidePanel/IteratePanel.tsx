import { useState, useRef, useEffect } from "react";
import styles from "./IteratePanel.module.css";
import { IconButton, ActionList, Box, Button } from "@primer/react";
import {
  PaperclipIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  LightBulbIcon,
  ChevronRightIcon,
  SquareFillIcon,
  FileAddedIcon,
  FileDiffIcon,
  FileRemovedIcon,
  SearchIcon,
  ToolsIcon,
  BugIcon,
  SyncIcon,
  PencilIcon,
} from "@primer/octicons-react";
import clsx from "clsx";

interface Version {
  id: string;
  prompt: string;
  timestamp: Date;
  changes?: string[]; // Messages in present tense
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

// Single source of truth for all messages - present tense
const THINKING_MESSAGES = [
  "Generating App.tsx",
  "Adding loading states",
  "Implementing user preferences",
  "Optimizing destination cards",
  "Enhancing itinerary generation",
  "Fixing TypeScript types",
  "Adding error handling",
  "Updating component props",
  "Cleaning up unused imports",
  "Fixing linting errors",
  "Optimizing performance",
  "Adding accessibility features",
  "Implementing responsive design",
  "Adding loading animations",
  "Updating color schemes",
  "Enhancing user interactions",
  "Testing edge cases"
];

// Helper to convert message to past tense
const toPastTense = (message: string) => {
  return message.replace(/ing(\s|$)/, 'ed$1');
};

interface Version {
  id: string;
  prompt: string;
  timestamp: Date;
  changes?: string[]; // Messages in present tense
}

const initialVersion: Version = {
  id: "initial",
  prompt:
    "Create an AI-powered vacation planner app that helps users find their perfect getaway. Include:\n- Preference inputs for climate, budget, activity level, and trip duration\n- AI-generated destination recommendations with images and details\n- Personalized itinerary generation\n- Loading states with step-by-step updates\n- Clean, modern UI with cards and intuitive navigation",
  timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  changes: [] // Will be populated during iteration
};

export const IteratePanel = ({ onVersionSelect, isIterating, setIsIterating }: IteratePanelProps) => {
  const [prompt, setPrompt] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState<Array<{ id: string; text: string; icon: typeof LightBulbIcon }>>([]);
  const [thinkingMessage, setThinkingMessage] = useState(THINKING_MESSAGES[0]);
  const [isThinkingMessageExiting, setIsThinkingMessageExiting] = useState(false);
  const [expandedChangesList, setExpandedChangesList] = useState<string | null>(null);
  const [collectedChanges, setCollectedChanges] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const updateThinkingMessage = (newMessage: string) => {
    setIsThinkingMessageExiting(true);
    setTimeout(() => {
      setThinkingMessage(newMessage);
      setIsThinkingMessageExiting(false);
      // Add message to collected changes
      setCollectedChanges(prev => [...prev, newMessage]);
    }, 200);
  };

  const [versions, setVersions] = useState<Version[]>([initialVersion]);
  const [selectedVersionId, setSelectedVersionId] = useState<string>(initialVersion.id);

  // Reset collected changes when starting iteration
  useEffect(() => {
    if (isIterating) {
      setCollectedChanges([]);
      // Start with a random message
      const firstMessage = THINKING_MESSAGES[Math.floor(Math.random() * THINKING_MESSAGES.length)];
      setThinkingMessage(firstMessage);
      setCollectedChanges([firstMessage]);
    }
  }, [isIterating]);

  // Watch for changes in isIterating to cycle through random messages
  useEffect(() => {
    if (isIterating) {
      const messageInterval = setInterval(() => {
        const availableMessages = THINKING_MESSAGES.filter(msg => !collectedChanges.includes(msg));
        if (availableMessages.length > 0) {
          const randomMessage = availableMessages[Math.floor(Math.random() * availableMessages.length)];
          updateThinkingMessage(randomMessage);
        }
      }, 3500);

      return () => clearInterval(messageInterval);
    }
  }, [isIterating, collectedChanges]);

  // Update version changes when iteration stops
  useEffect(() => {
    if (!isIterating && collectedChanges.length > 0) {
      setVersions(prev => prev.map(v => 
        v.id === selectedVersionId
          ? { ...v, changes: collectedChanges }
          : v
      ));
    }
  }, [isIterating]);

  // Watch for changes in suggestions loading state
  useEffect(() => {
    if (!isLoadingSuggestions && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isLoadingSuggestions]);

  // Simulate API call to fetch suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 second delay
      setSuggestions(getRandomSuggestions(3)); // Get 3 random suggestions
      setIsLoadingSuggestions(false);
    };
    loadSuggestions();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [versions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isIterating) return;

    const newVersionId = Date.now().toString();
    setVersions(prev => [...prev, {
      id: newVersionId,
      prompt: prompt.trim(),
      timestamp: new Date(),
      changes: []
    }]);
    setPrompt("");
    setSelectedVersionId(newVersionId);
    setIsIterating(true);

    // Stop iteration after 8 seconds
    setTimeout(() => {
      setIsIterating(false);
    }, 8000);
  };

  const handleSuggestionSelect = async (suggestion: { id: string; text: string }) => {
    const newVersionId = Date.now().toString();
    const newVersion: Version = {
      id: newVersionId,
      prompt: suggestion.text,
      timestamp: new Date(),
      changes: []
    };
    setVersions([...versions, newVersion]);
    setSelectedVersionId(newVersionId);
    setIsIterating(true);

    // Stop iteration after 8 seconds
    setTimeout(() => {
      setIsIterating(false);
    }, 8000);

    // Show loading state and regenerate suggestions
    setIsLoadingSuggestions(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setSuggestions(getRandomSuggestions(3));
    setIsLoadingSuggestions(false);
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
            <div
              key={version.id}
              className={clsx(styles.activityItem, {
                [styles.activityItemActive]: selectedVersionId === version.id,
                [styles.iterating]: selectedVersionId === version.id && isIterating
              })}
              onClick={() => handleVersionClick(version)}
            >
              <div
                className={`${styles.refinement} ${selectedVersionId === version.id ? styles.refinementActive : ""}`}
              >
                {version.prompt}
                {selectedVersionId === version.id && isIterating && (
                  <div className={`${styles.thinkingCaption} ${isThinkingMessageExiting ? styles.messageExiting : ''}`}>
                    {thinkingMessage}
                  </div>
                )}
                {selectedVersionId === version.id && !isIterating && version.changes && (
                  <>
                    <div 
                      className={styles.changesCaption}
                      onClick={() => setExpandedChangesList(expandedChangesList === version.id ? null : version.id)}
                    >
                      Made {version.changes.length} changes
                      <ChevronRightIcon 
                        className={clsx(styles.changesCaptionIcon, {
                          [styles.expanded]: expandedChangesList === version.id
                        })}
                        size={12}
                      />
                    </div>
                    <div className={clsx(styles.changesList, {
                      [styles.expanded]: expandedChangesList === version.id
                    })}>
                      {version.changes?.map((change, index) => (
                        <div key={index} className={styles.changesListItem}>
                          <SyncIcon size={12} className={styles.changesListIcon} />
                          <span>{toPastTense(change)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {selectedVersionId === version.id && !isIterating && version.changes && version.id !== versions[versions.length - 1].id && (
                <Button 
                  variant="default" 
                  size="small"
                  className={styles.restoreButton}
                >
                  Restore version
                </Button>
              )}
            </div>
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
                      onSelect={() => handleSuggestionSelect(suggestion)}
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
              <IconButton
                icon={isIterating ? SquareFillIcon : PaperAirplaneIcon}
                aria-label={isIterating ? "Stop iteration" : "Start iteration"}
                variant="invisible"
                className={clsx(styles.sendButton, {
                  [styles.iterating]: isIterating
                })}
                onClick={() => setIsIterating(!isIterating)}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
