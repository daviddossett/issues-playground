import Editor from '@monaco-editor/react';
import styles from './CodeEditor.module.css';

interface CodeEditorProps {
  content: string;
  language: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ content, language }) => {
  return (
    <div className={styles.editorContainer}>
      <Editor
        height="100%"
        defaultLanguage={language}
        value={content}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
          lineNumbers: 'on',
          folding: true,
          glyphMargin: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          renderLineHighlight: 'all',
          scrollbar: {
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          },
          overviewRulerBorder: false,
          renderValidationDecorations: 'off'
        }}
      />
    </div>
  );
}; 