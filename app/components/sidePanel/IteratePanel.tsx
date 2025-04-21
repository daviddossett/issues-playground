import { useState, useRef } from "react";
import styles from "./IteratePanel.module.css";
import { IconButton } from "@primer/react";
import { PaperclipIcon, PaperAirplaneIcon } from "@primer/octicons-react";

interface Version {
  id: string;
  prompt: string;
  timestamp: Date;
}

interface IteratePanelProps {
  onVersionSelect: (version: Version) => void;
}

export const IteratePanel = ({ onVersionSelect }: IteratePanelProps) => {
  const [prompt, setPrompt] = useState("");
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
  );
};
