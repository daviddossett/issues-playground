import Editor from '@monaco-editor/react';
import { useTheme } from '@primer/react';
import clsx from 'clsx';
import styles from './CodeEditor.module.css';

interface CodeEditorProps {
  content: string;
  language: string;
  isIterating?: boolean;
}

export const CodeEditor = ({ content, language, isIterating }: CodeEditorProps) => {
  const { colorScheme } = useTheme();
  
  const options = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    scrollbar: {
      vertical: 'auto' as const,
      horizontal: 'auto' as const,
    },
    fontSize: 12,
    lineHeight: 1.5,
    padding: { top: 16, bottom: 16 },
    fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
  };

  const beforeMount = (monaco: any) => {
    monaco.editor.defineTheme('github-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6e7781' },
        { token: 'keyword', foreground: 'cf222e' },
        { token: 'string', foreground: '0a3069' },
        { token: 'number', foreground: '0550ae' },
        { token: 'type', foreground: '953800' },
        { token: 'class', foreground: '953800' },
        { token: 'function', foreground: '8250df' },
        { token: 'variable', foreground: '24292f' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#24292f',
        'editor.lineHighlightBackground': '#f6f8fa',
        'editorLineNumber.foreground': '#8c959f',
        'editor.selectionBackground': '#add6ff80',
        'editor.inactiveSelectionBackground': '#add6ff40',
      }
    });

    monaco.editor.defineTheme('github-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '8b949e' },
        { token: 'keyword', foreground: 'ff7b72' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'number', foreground: '79c0ff' },
        { token: 'type', foreground: 'ffa657' },
        { token: 'class', foreground: 'ffa657' },
        { token: 'function', foreground: 'd2a8ff' },
        { token: 'variable', foreground: 'c9d1d9' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#c9d1d9',
        'editor.lineHighlightBackground': '#161b22',
        'editorLineNumber.foreground': '#8b949e',
        'editor.selectionBackground': '#264f7840',
        'editor.inactiveSelectionBackground': '#264f7820',
      }
    });
  };

  return (
    <div className={clsx(styles.editorContainer, {
      [styles.iterating]: isIterating
    })}>
      <Editor
        height="100%"
        defaultLanguage={language}
        value={content}
        theme={colorScheme === 'dark' ? 'github-dark' : 'github-light'}
        beforeMount={beforeMount}
        options={options}
      />
    </div>
  );
}; 