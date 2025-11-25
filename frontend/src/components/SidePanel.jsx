import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaFile, FaTimes, FaTerminal } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import FileTree from "./FileTree";
import CodeEditor from "./Editor";
import Term from "./Terminal.jsx";
import { Terminal } from "xterm";

const SidePanel = ({
  files,
  currentfile,
  setCurrentfile,
  webContainer,
  runProcess,
  setRunProcess,
  setIframeUrl,
  updateFiletree,
  theme,
}) => {
  const [isFilesSidebarOpen, setIsFilesSidebarOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminal, setTerminal] = useState(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsFilesSidebarOpen(false);
      }
    };

    if (isFilesSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilesSidebarOpen]);

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsFilesSidebarOpen(!isFilesSidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            <FaFile size={20} />
          </button>
          <button
            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
            className="text-gray-400 hover:text-white"
          >
            <FaTerminal size={20} />
          </button>
        </div>
        <h1>Code Editor</h1>
        <button
          onClick={async () => {
            if (!webContainer) return;
            if (runProcess) {
              runProcess.kill();
              setRunProcess(null);
              setIframeUrl(null);
            }
            const term = new Terminal({
              theme: { background: "#000", foreground: "#fff" },
            });
            setTerminal(term);
            setIsTerminalOpen(true);

            await webContainer.mount(files.filetree);

            const filesList = await webContainer.fs.readdir("/");
            if (filesList.includes("package.json")) {
              const installProcess = await webContainer.spawn("npm", [
                "install",
              ]);
              installProcess.output.pipeTo(
                new WritableStream({
                  write(data) {
                    term.write(data);
                  },
                })
              );
              const installExitCode = await installProcess.exit;
              if (installExitCode !== 0) {
                term.write(
                  `'npm install' failed with exit code ${installExitCode}`
                );
                return;
              }
              const process = await webContainer.spawn("npm", ["start"]);
              setRunProcess(process);
              process.output.pipeTo(
                new WritableStream({
                  write(data) {
                    term.write(data);
                  },
                })
              );
            } else if (files.includes("index.html")) {
              const process = await webContainer.spawn("npx", [
                "serve",
                "-s",
                ".",
              ]);
              setRunProcess(process);
              process.output.pipeTo(
                new WritableStream({
                  write(data) {
                    term.write(data);
                  },
                })
              );
            } else {
              term.write("Could not determine how to run this project.");
            }

            webContainer.on("server-ready", (port, url) => {
              setIframeUrl(url);
            });
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors focus:outline-none ${
            theme === "light"
              ? "bg-black hover:bg-gray-800 text-white"
              : "bg-transparent border border-white hover:bg-gray-700 text-white"
          }`}
        >
          <FaPlay size={14} />
          <span className="text-sm font-semibold">Run</span>
        </button>
      </div>

      <div className="flex-1 relative">
        <CodeEditor
          file={currentfile}
          onChange={(newValue) => {
            setCurrentfile({ ...currentfile, value: newValue });
            // Debounce this call in a real app
            const pathParts = currentfile.path.split("/");
            let current = files.filetree;
            for (let i = 0; i < pathParts.length - 1; i++) {
              current = current[pathParts[i]].directory;
            }
            current[pathParts[pathParts.length - 1]].file.contents = newValue;
            updateFiletree(files.filetree);
          }}
          theme={theme}
        />
      </div>

      <AnimatePresence>
        {isTerminalOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 300 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-black overflow-hidden"
          >
            <Term terminal={terminal} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFilesSidebarOpen && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-0 left-0 h-full w-80 bg-gray-900 shadow-lg z-10 flex flex-col"
          >
            <div className="flex justify-end p-2">
              <button
                onClick={() => setIsFilesSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FileTree
                files={files}
                onFileClick={(path, content) => {
                  setCurrentfile({
                    path,
                    value: content,
                    language: "javascript",
                  });
                  setIsFilesSidebarOpen(false);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidePanel;
