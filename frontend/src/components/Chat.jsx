import React from "react";
import Markdown from "markdown-to-jsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const Chat = ({
  messages,
  user,
  geminiError,
  message,
  setMessage,
  handleSendMessage,
  isLoading,
  theme,
}) => {
  return (
    <div
      className={`flex-1 flex flex-col ${
        theme === "light" ? "bg-white" : "bg-gray-900"
      }`}
    >
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {geminiError && (
          <div className="bg-red-500 text-white p-4 rounded-lg">
            {geminiError}
          </div>
        )}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 text-sm">
            <div className="max-w-lg">
              <h2 className="text-lg font-bold text-gray-300 mb-2">
                Welcome to the Collaborative Coding Environment!
              </h2>
              <p className="mb-4">
                This is a shared space where you can code, chat, and collaborate
                with your team and our AI assistant.
              </p>
              <div className="text-left">
                <h3 className="font-bold text-gray-300">How to use the AI:</h3>
                <ul className="list-disc list-inside mb-2">
                  <li>
                    To ask the AI a question about your project, start your
                    message with{" "}
                    <code className="bg-gray-700 p-1 rounded">@ai</code> or{" "}
                    <code className="bg-gray-700 pl-1 rounded">@AI</code>.
                  </li>
                  <li className="text-gray-200">
                    In mobile screens you can't use the code editor. only user
                    can chat with the AI.
                  </li>
                  <li>
                    For example:{" "}
                    <code className="bg-gray-700 p-1 rounded">
                      @ai create an express server
                    </code>
                  </li>
                </ul>
                <h3 className="font-bold text-gray-300">
                  Collaborating with your team:
                </h3>
                <ul className="list-disc list-inside mb-2">
                  <li>
                    You can invite other users to this project to chat and code
                    together in real-time.
                  </li>
                  <li>
                    Click the '+' icon in the header to add collaborators.
                  </li>
                </ul>
                <h3 className="font-bold text-gray-300">
                  Using the Code Editor:
                </h3>
                <ul className="list-disc list-inside">
                  <li>
                    The code editor on the right allows you to create and edit
                    files.
                  </li>
                  <li>
                    When you ask the AI to create a project (e.g., an Express
                    server), the files will appear in the file sidebar.
                  </li>
                  <li>
                    Click the "Run" button to execute the code and see the
                    output.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.sender === user._id ? "items-end" : "items-start"
            }`}
          >
            <div
              className={` hide-scrollbar relative max-w-[70%] px-5 py-3 break-words whitespace-pre-wrap rounded-lg ${
                msg.sender === user._id
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : msg.sender === "ai" || msg.sender?._id === "ai"
                  ? "bg-gray-700 rounded-tl-none overflow-scroll"
                  : "bg-gray-700 rounded-tl-none"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 mb-1">
                  {msg.sender === user._id
                    ? user.email || "You"
                    : msg.sender?.email || "AI"}
                </span>
                <Markdown
                  options={{
                    overrides: {
                      pre: ({
                        children: {
                          props: { children, className },
                        },
                      }) => {
                        const language = className
                          ? className.replace("language-", "")
                          : "";
                        return (
                          <div className="w-full relative group">
                            <SyntaxHighlighter
                              language={language}
                              style={vscDarkPlus}
                              className="!p-4 !text-sm !bg-gray-800 !rounded-md w-full"
                            >
                              {children}
                            </SyntaxHighlighter>
                          </div>
                        );
                      },
                    },
                  }}
                >
                  {msg.text}
                </Markdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-lg p-4 max-w-[70%]">
              <div className="flex items-center">
                <div className="animate-pulse flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSendMessage}
        className={`p-4 border-t ${
          theme === "light"
            ? "bg-gray-100 border-gray-200"
            : "bg-gray-800/50 border-gray-700"
        }`}
      >
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message or ask AI..."
            className={`w-full rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-2 ${
              theme === "light"
                ? "bg-gray-200 text-black focus:ring-black"
                : "bg-gray-700 text-white focus:ring-white"
            }`}
          />
          <button
            type="submit"
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors focus:outline-none ${
              theme === "light"
                ? "bg-black hover:bg-gray-800"
                : "bg-transparent  hover:bg-gray-700"
            }`}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-white"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
