import React from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ file, onChange, theme }) => {
  return (
    <Editor
      height="100%"
      language={file.language || "javascript"}
      value={file.value}
      onChange={onChange}
      theme={theme === "dark" ? "vs-dark" : "light"}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        scrollBeyondLastLine: false,
      }}
    />
  );
};

export default CodeEditor;
