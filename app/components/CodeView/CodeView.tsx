import { Box, Button, IconButton, TreeView, ActionMenu, ActionList } from "@primer/react";
import {
  FileCodeIcon,
  TriangleDownIcon,
  CopyIcon,
  CodeIcon,
  FileDirectoryIcon,
} from "@primer/octicons-react";
import { useState, useEffect } from "react";
import styles from "./CodeView.module.css";
import { CodeEditor } from "../CodeEditor/CodeEditor";

interface FileItem {
  name: string;
  path: string;
  type: "file" | "directory";
  content?: string;
  language?: string;
  children?: FileItem[];
}

const files: FileItem[] = [
  {
    name: "app",
    path: "app",
    type: "directory",
    children: [
      {
        name: "components",
        path: "app/components",
        type: "directory",
        children: [
          {
            name: "AIAppMock",
            path: "app/components/AIAppMock",
            type: "directory",
            children: [
              {
                name: "AIAppMock.tsx",
                path: "app/components/AIAppMock/AIAppMock.tsx",
                type: "file",
                language: "typescript",
                content: `// AIAppMock.tsx
"use client";

import { useState, useEffect } from "react";
import styles from "./AIAppMock.module.css";

interface Destination {
  id: number;
  name: string;
  image: string;
  description: string;
  activities: string[];
  weather: string;
  budget: string;
}

interface AIAppMockProps {
  isIterating: boolean;
  setIsIterating: (isIterating: boolean) => void;
}

export default function AIAppMock({ isIterating, setIsIterating }: AIAppMockProps) {
  // User preferences state
  const [preferences, setPreferences] = useState({
    climate: "warm",
    budget: "moderate",
    activityLevel: "moderate",
    duration: 7,
  });

  // App state
  const [loading, setLoading] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [itinerary, setItinerary] = useState<string[]>([]);
  const [showItinerary, setShowItinerary] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing your preferences...");
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isMessageExiting, setIsMessageExiting] = useState(false);

  // Loading messages for the animation
  const loadingMessages = [
    "Analyzing your preferences...",
    "Adding some AI magic...",
    "Optimizing the interface...",
    "Generating fresh ideas...",
    "Making it more delightful...",
    "Adding that special touch...",
    "Almost there...",
  ];

  // Update loading message with animation
  const updateMessage = (newMessage: string) => {
    setIsMessageExiting(true);
    setTimeout(() => {
      setLoadingMessage(newMessage);
      setIsMessageExiting(false);
    }, 200);
  };

  // Handle iteration state changes
  useEffect(() => {
    if (isIterating) {
      setIsExiting(false);
      setShouldRender(true);
      setIsMessageExiting(false);
      let messageIndex = 1;

      const messageInterval = setInterval(() => {
        updateMessage(loadingMessages[messageIndex]);
        messageIndex = (messageIndex + 1) % loadingMessages.length;
      }, 2000);

      const loadingDuration = Math.floor(Math.random() * 5000) + 10000;
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          clearInterval(messageInterval);
          setIsIterating(false);
          setLoadingMessage(loadingMessages[0]);
          setShouldRender(false);
        }, 200);
      }, loadingDuration);

      return () => clearInterval(messageInterval);
    }
  }, [isIterating]);

  return (
    <div className={styles.appContainer}>
      {shouldRender && (
        <div className={\`\${styles.loadingOverlay} \${isExiting ? styles.exiting : ''}\`}>
          <svg className={styles.sparkleSpinner}>
            <use href="#sparkle-spinner" />
          </svg>
          <div className={styles.loadingMessageContainer}>
            <p className={\`\${styles.loadingMessage} \${isMessageExiting ? styles.exiting : ''}\`}>
              {loadingMessage}
            </p>
          </div>
        </div>
      )}
      <div className={styles.header}>
        <h1>Travel Planner</h1>
        <p>Let AI find your perfect getaway</p>
      </div>
      <div className={styles.mainContent}>
        {/* Main app content here */}
      </div>
    </div>
  );
}`
              },
              {
                name: "AIAppMock.module.css",
                path: "app/components/AIAppMock/AIAppMock.module.css",
                type: "file",
                language: "css",
                content: `/* Modern Vacation Planner Styling */
.appContainer {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  overflow: auto;
  background-color: #f1f5f9;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.header h1 {
  font-size: 2.8rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #4f46e5, #06b6d4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
}

.header p {
  font-size: 1.2rem;
  color: #6b7280;
  font-weight: 400;
}

.loadingOverlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: var(--borderRadius-large);
  gap: var(--stack-gap-normal);
  opacity: 0;
  animation: fadeIn 0.2s cubic-bezier(0.33, 1, 0.68, 1) forwards;
}

.sparkleSpinner {
  inline-size: 32px;
  block-size: 32px;
  animation: sparkle-spinner 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  container: strict;
}

@keyframes sparkle-spinner {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
}

.loadingMessageContainer {
  position: relative;
  min-height: 24px;
  min-width: 200px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.loadingMessage {
  color: var(--fgColor-muted);
  font: var(--text-body-shorthand-medium);
  text-align: center;
  position: absolute;
  width: 100%;
  animation: messageIn 0.2s cubic-bezier(0.33, 1, 0.68, 1) forwards;
}

.loadingMessage.exiting {
  animation: messageOut 0.2s cubic-bezier(0.33, 1, 0.68, 1) forwards;
}

@keyframes messageIn {
  0% { opacity: 0; transform: translateY(100%); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes messageOut {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-100%); }
}`
              }
            ]
          },
          {
            name: "header",
            path: "app/components/header",
            type: "directory",
            children: [
              { name: "header.tsx", path: "app/components/header/header.tsx", type: "file" },
              { name: "header.module.css", path: "app/components/header/header.module.css", type: "file" },
            ],
          },
          {
            name: "MainContent",
            path: "app/components/MainContent",
            type: "directory",
            children: [
              { name: "MainContent.tsx", path: "app/components/MainContent/MainContent.tsx", type: "file" },
              { name: "MainContent.module.css", path: "app/components/MainContent/MainContent.module.css", type: "file" },
            ],
          },
          {
            name: "SidePanel",
            path: "app/components/SidePanel",
            type: "directory",
            children: [
              { name: "SidePanel.tsx", path: "app/components/SidePanel/SidePanel.tsx", type: "file" },
              { name: "SidePanel.module.css", path: "app/components/SidePanel/SidePanel.module.css", type: "file" },
              { name: "IteratePanel.tsx", path: "app/components/SidePanel/IteratePanel.tsx", type: "file" },
              { name: "IteratePanel.module.css", path: "app/components/SidePanel/IteratePanel.module.css", type: "file" },
            ],
          },
        ],
      },
      { name: "page.tsx", path: "app/page.tsx", type: "file" },
      { name: "page.module.css", path: "app/page.module.css", type: "file" },
      { name: "layout.tsx", path: "app/layout.tsx", type: "file" },
    ],
  },
];

interface CodeViewProps {
  isNavVisible: boolean;
  toggleNavVisibility: () => void;
  viewMode: "preview" | "code" | "split";
}

export const CodeView: React.FC<CodeViewProps> = ({
  isNavVisible,
  toggleNavVisibility,
  viewMode,
}) => {
  const [isFileTreeVisible, setIsFileTreeVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>("app/components/AIAppMock/AIAppMock.tsx");

  useEffect(() => {
    setIsFileTreeVisible(viewMode === "code");
  }, [viewMode]);

  const toggleFileTree = () => {
    setIsFileTreeVisible(!isFileTreeVisible);
  };

  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
  };

  const findFileContent = (path: string): { content: string; language: string } => {
    const findInItems = (items: FileItem[]): FileItem | undefined => {
      for (const item of items) {
        if (item.path === path) return item;
        if (item.children) {
          const found = findInItems(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const file = findInItems(files);
    return {
      content: file?.content || '// No content available',
      language: file?.language || 'typescript'
    };
  };

  const renderTreeItems = (items: FileItem[]) => {
    return items.map((item) => (
      <TreeView.Item
        key={item.path}
        id={item.path}
        defaultExpanded={item.path === "app" || item.path.includes(selectedFile)}
        onSelect={item.type === "file" ? () => handleFileSelect(item.path) : undefined}
      >
        <TreeView.LeadingVisual>
          {item.type === "directory" ? <FileDirectoryIcon /> : <CodeIcon />}
        </TreeView.LeadingVisual>
        {item.name}
        {item.children && (
          <TreeView.SubTree>
            {renderTreeItems(item.children)}
          </TreeView.SubTree>
        )}
      </TreeView.Item>
    ));
  };

  const getAllFiles = (items: FileItem[]): FileItem[] => {
    return items.reduce((acc: FileItem[], item) => {
      if (item.type === "file") {
        acc.push(item);
      }
      if (item.children) {
        acc.push(...getAllFiles(item.children));
      }
      return acc;
    }, []);
  };

  const allFiles = getAllFiles(files);
  const currentFile = allFiles.find(f => f.path === selectedFile);

  return (
    <Box className={styles.container}>
      <Box className={styles.toolbar}>
        <Box className={styles.toolbarLeft}>
          <IconButton
            variant="invisible"
            icon={FileDirectoryIcon}
            aria-label={isFileTreeVisible ? "Hide file tree" : "Show file tree"}
            onClick={toggleFileTree}
          />
          <div className={styles.divider} />
        </Box>
        <ActionMenu>
          <ActionMenu.Button
            variant="invisible"
            trailingAction={TriangleDownIcon}
          >
            {currentFile?.name || "Select a file"}
          </ActionMenu.Button>
          <ActionMenu.Overlay>
            <ActionList selectionVariant="single">
              {allFiles.map((file) => (
                <ActionList.Item
                  key={file.path}
                  selected={file.path === selectedFile}
                  onSelect={() => handleFileSelect(file.path)}
                >
                  <ActionList.LeadingVisual>
                    <CodeIcon />
                  </ActionList.LeadingVisual>
                  {file.name}
                </ActionList.Item>
              ))}
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
        <Box className={styles.toolbarRight}>
          <IconButton variant="invisible" icon={CopyIcon} aria-label="Copy code" />
          {/* <Button trailingAction={TriangleDownIcon} variant="invisible">
            Open in
          </Button> */}
        </Box>
      </Box>
      <Box className={styles.innerContainer}>
        <div className={styles.contentWrapper}>
          <div className={`${styles.fileTreeContainer} ${isFileTreeVisible ? styles.visible : ''}`}>
            <div className={styles.fileTree}>
              <TreeView aria-label="Files">
                {renderTreeItems(files)}
              </TreeView>
            </div>
          </div>
          <Box className={styles.content}>
            <CodeEditor 
              content={findFileContent(selectedFile).content}
              language={findFileContent(selectedFile).language}
            />
          </Box>
        </div>
      </Box>
    </Box>
  );
}; 