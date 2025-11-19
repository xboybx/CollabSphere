import React, { useState, useCallback, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axios.config.js";
import {
  socketInstance,
  sendMessage,
  receiveMessage,
} from "../Context/SocketContext.jsx";
import {
  FaUsers,
  FaTimes,
  FaUserFriends,
  FaPlus,
  FaPlay,
} from "react-icons/fa";
import { userContext } from "../Context/UsercontextProvider.jsx";
import Markdown from "markdown-to-jsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { DotLoader, RingLoader } from "react-spinners";
import { getWebContainer } from "../../config/Webcontainer.js";
import { Sun, Moon, Code2, Home } from "lucide-react";

const NewCreatedProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [webContainer, setWebContainer] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [runProcess, setRunProcess] = useState(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [leftPaneWidth, setLeftPaneWidth] = useState(50); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const [allusers, setaAllusers] = useState([]);
  const [allusersmodal, setaAllusersModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [files, setFiles] = useState({
    filetree: {},
  });
  const [currentfile, setCurrentfile] = useState("");
  const [isCodeEditorVisible, setIsCodeEditorVisible] = useState(true);
  const [geminiError, setGeminiError] = useState(null);
  const { user, theme, setTheme } = useContext(userContext);

  //to Connect the socket before any messages
  useEffect(() => {
    if (projectId) {
      socketInstance(projectId);
    }
    receiveMessage("gemini-error", (error) => {
      setGeminiError(error.message);
      setIsLoading(false);
    });
  }, [projectId]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.trim()) {
      sendMessage("project-message", {
        message: message,
        sender: user._id,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: user._id },
      ]);
      setMessage("");
      // Only set loading when message is for AI
      if (message.includes("@ai")) {
        setIsLoading(true);
        setGeminiError(null);
      }
    }
  };

  const getallUsers = async () => {
    try {
      const allusers = await axios.get("/users/allUsers");
      setaAllusers(allusers.data.allUsers);
    } catch (err) {
      console.error("Error fetching all users:", err);
      throw new Error("Failed to fetch all users");
    }
  };

  const adduserToProject = async (userId) => {
    try {
      const response = await axios.put("/projects/add-user", {
        projectId: project._id,
        users: [userId],
      });
      const projectResponse = await axios.get(
        `/projects/get-project/${project._id}`
      );
      if (projectResponse.data && projectResponse.data.project) {
        setProject(projectResponse.data.project);
      }
      setIsDrawerOpen(false);
      setaAllusersModal(false);
      getallUsers();
    } catch (err) {
      console.error("Error adding user to project:", err);
      throw new Error("Failed to add user to project");
    }
  };

  const removeuserFromProject = async (userId) => {
    try {
      const response = await axios.put("/projects/remove-user", {
        projectId: project._id,
        users: [userId],
      });
      const projectResponse = await axios.get(
        `/projects/get-project/${project._id}`
      );
      if (projectResponse.data && projectResponse.data.project) {
        setProject(projectResponse.data.project);
      }
      setaAllusersModal(false);
      getallUsers();
    } catch (err) {
      console.error("Error removing user from project:", err);
      throw new Error("Failed to remove user from project");
    }
  };

  const updateFiletree = async (updatedFiles) => {
    console.log("Updating filetree:", updatedFiles);

    if (!project?._id || !updatedFiles) {
      console.error("Project ID and file tree are required");
      return;
    }

    try {
      const response = await axios.put("/projects/update-filetree", {
        projectId: project._id,
        filetree: updatedFiles,
      });
      console.log("Filetree update response:", response);
    } catch (err) {
      console.error("Error updating filetree:", err);
    }
  };

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e) => {
      if (isResizing) {
        const width = (e.clientX / window.innerWidth) * 100;
        setLeftPaneWidth(Math.min(Math.max(width, 20), 80));
      }
    },
    [isResizing]
  );

  //Fetch Project Details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/projects/get-project/${projectId}`);
        if (response.data && response.data.project) {
          setProject(response.data.project);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        navigate("/");
      }
    };

    if (projectId && !project) {
      fetchProject();
    }
  }, [projectId, navigate]);

  useEffect(() => {
    if (!project) return;

    console.log("Project ID:", project);

    socketInstance(project._id);

    //Creating a webcontainer instance
    if (!webContainer) {
      getWebContainer().then((instance) => {
        setWebContainer(instance);
        console.log("WebContainer instance created");
      });
    }

    const messageHandler = (data) => {
      if (data.sender._id == "ai") {
        let msg;
        try {
          msg = JSON.parse(data.message);
        } catch (e) {
          msg = data.message;
        }

        //mounting the file tree to webcontainer
        webContainer?.mount(msg.fileTree);

        console.log("AI message received:", msg);
        // Only show text part in chat messages
        if (msg?.fileTree) {
          setFiles((prevFiles) => ({
            ...prevFiles,
            filetree: msg.fileTree,
          }));
          // Replace data.message with only text for chat display
          if (typeof msg === "object" && "text" in msg) {
            data.message = msg.text;
          } else {
            data.message = msg;
          }
        } else if (typeof msg === "object" && "text" in msg) {
          // For normal AI response with text property only
          data.message = msg.text;
        } else {
          data.message = msg;
        }
      }

      //setting all recieved messages of chat in the messages state
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: data.message?.text || data.message,
          sender: data.sender,
        },
      ]);
      setIsLoading(false); // Set loading false when AI message received
    };

    receiveMessage("project-message", messageHandler);

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);

    return () => {
      if (typeof removeMessageListener === "function") {
        removeMessageListener("project-message", messageHandler);
      }
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [projectId, resize, stopResizing]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <RingLoader color="#3ECF8E" size={60} />
          <p className="mt-4 text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-screen relative font-sans ${
        isResizing ? "select-none" : ""
      } bg-gray-900 text-white`}
      style={{ cursor: isResizing ? "col-resize" : "auto" }}
    >
      <div
        className="flex flex-col shadow-lg rounded-lg"
        style={{ width: `${leftPaneWidth}%` }}
      >
        <div className="h-16 flex items-center px-6 justify-between rounded-t-md border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none"
              title="Back to Home"
            >
              <Home size={20} />
            </button>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 focus:outline-none"
            >
              <FaUsers size={20} />
              <div className="text-sm font-medium font-sans">
                {` ${user && user.email ? user.email.split("@")[0] : "User"}`}
              </div>
            </button>
          </div>

          <h2 className="text-xl font-bold font-sans bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent">
            {project?.name || "Project"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCodeEditorVisible(!isCodeEditorVisible)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors focus:outline-none"
              title={
                isCodeEditorVisible ? "Hide Code Editor" : "Show Code Editor"
              }
            >
              <Code2 size={18} />
              <span className="text-sm">
                {isCodeEditorVisible ? "Hide" : "Show"}
              </span>
            </button>
            <button
              onClick={() => {
                setaAllusersModal(true);
                getallUsers();
              }}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none"
              title="Add Collaborator"
            >
              <FaPlus size={18} />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-700 focus:outline-none transition-colors"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
        {/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Allusers modal to add xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}
        {allusersmodal && (
          <div className="absolute top-[30%] right-[50%] bg-gray-800 p-6 rounded-md shadow-lg z-50 w-80 border border-gray-700">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
              <h3 className="text-lg font-semibold font-sans text-white">
                All Users
              </h3>
              <button
                onClick={() => setaAllusersModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {allusers
                ?.filter(
                  (user) =>
                    !project?.users?.some(
                      (projectUser) => projectUser._id === user._id
                    )
                )
                ?.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => {
                      adduserToProject(user._id);
                    }}
                    className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-md transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                      <FaUserFriends size={16} />
                    </div>
                    <span className="text-white">
                      {user.email ? user.email.split("@")[0] : "Unknown User"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
        {/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Messages xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {geminiError && (
            <div className="bg-red-500 text-white p-4 rounded-lg">
              {geminiError}
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
                <div>
                  <span className="text-xs text-gray-400 mb-1">
                    {msg.sender === user._id
                      ? user.email || "You"
                      : typeof msg.sender === "object"
                      ? msg.sender?.email || "Unknown User"
                      : project?.users?.find((u) => u._id === msg.sender)
                          ?.email || "Unknown User"}
                  </span>
                </div>
                {msg.sender === "ai" || msg.sender?._id === "ai" ? (
                  typeof msg.text === "string" ? (
                    currentfile.endsWith(".html") ? (
                      <SyntaxHighlighter language="html" style={vscDarkPlus}>
                        {msg.text}
                      </SyntaxHighlighter>
                    ) : (
                      <Markdown
                        options={{
                          overrides: {
                            a: {
                              props: {
                                rel: "noopener noreferrer",
                                target: "_blank",
                              },
                            },
                            link: {
                              props: {
                                rel: "stylesheet",
                              },
                            },
                          },
                        }}
                      >
                        {msg.text}
                      </Markdown>
                    )
                  ) : (
                    <p>Unable to display message content</p>
                  )
                ) : (
                  msg.text
                )}
                <div
                  className={`absolute top-0 ${
                    msg.sender === user._id
                      ? "right-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-blue-600"
                      : msg.sender === "ai"
                      ? "left-0 border-r-[10px] border-r-transparent border-t-[10px] border-t-gray-700"
                      : "left-0 border-r-[10px] border-r-transparent border-t-[10px] border-t-gray-700"
                  }`}
                />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col items-start">
              <RingLoader
                color={theme === "dark" ? "white" : "black"}
                size={20}
              />
            </div>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-6 border-t border-gray-700"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-5 py-3 rounded-full border-2 bg-transparent border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
      {/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ResizeBar column xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}
      {isCodeEditorVisible && (
        <div
          className="w-1 bg-gray-700 hover:bg-gray-600 cursor-col-resize active:bg-primary transition-colors"
          onMouseDown={startResizing}
        />
      )}

      {/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  Project rightside code xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}
      {/* ..................................vertical FileTree Render............................................. */}
      {isCodeEditorVisible && (
        <div
          className="flex px-1 overflow-auto"
          style={{ width: `${100 - leftPaneWidth}%` }}
        >
          <div className="treeleft w-[210px] h-full py-8 border-r-2 border-gray-700 overflow-y-auto">
            {Object.keys(files.filetree)?.map((file, index) => (
              <div
                key={index}
                className={`flex items-center px-2 py-1 mb-1 rounded text-sm cursor-pointer ${
                  currentfile === file
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 text-xs"
                }`}
                onClick={() => setCurrentfile(file)}
              >
                <span className="w-4 mr-2">
                  {file.endsWith(".js") ? (
                    <svg
                      className="w-4 h-4 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : file.endsWith(".json") ? (
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  )}
                </span>
                <span className="truncate">{file}</span>
              </div>
            ))}
          </div>

          {/* ...........................horizontal FileTree Render on top and total right sides righ ride the file viewer and code editor..............................................  */}
          <div className="treeleft w-full h-full">
            <div className="justify-between topfiles w-full px-4 py-1 h-10 flex items-center border-b border-gray-700 overflow-x-auto">
              <div className="flex">
                {Object.keys(files.filetree).map((file, indx) => (
                  <div
                    key={indx}
                    className={`flex items-center px-3 py-1 mx-1 rounded-t-lg cursor-pointer text-sm ${
                      currentfile === file
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    onClick={() => setCurrentfile(file)}
                  >
                    <span className="w-4 mr-1">
                      {file.endsWith(".js") ? (
                        <svg
                          className="w-3 h-3 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : file.endsWith(".json") ? (
                        <svg
                          className="w-3 h-3 text-yellow-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-3 h-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="truncate">{file}</span>
                  </div>
                ))}
              </div>
              {files && (
                <button
                  onClick={async () => {
                    await webContainer?.mount(files.filetree);

                    // First check if node_modules exists
                    const hasNodeModules = await webContainer.fs
                      .readdir("/")
                      .then(
                        (files) => files.includes("node_modules"),
                        () => false
                      );

                    // Run npm install if node_modules doesn't exist
                    if (!hasNodeModules) {
                      const installProcess = await webContainer.spawn("npm", [
                        "install",
                      ]);
                      installProcess.output.pipeTo(
                        new WritableStream({
                          write(chunk) {
                            console.log(chunk);
                          },
                        })
                      );
                      await installProcess.exit;
                    }

                    if (runProcess) {
                      runProcess.kill();
                    }

                    let tempRunProcess = await webContainer.spawn("npm", [
                      "start",
                    ]);

                    tempRunProcess.output.pipeTo(
                      new WritableStream({
                        write(chunk) {
                          console.log(chunk);
                        },
                      })
                    );

                    setRunProcess(tempRunProcess);

                    webContainer.on("server-ready", (port, url) => {
                      console.log(port, url);
                      setIframeUrl(url);
                    });
                  }}
                >
                  <FaPlay />
                </button>
              )}
            </div>
            {/* .................................CurrentFile in the code edtior.............................................. */}
            {currentfile && (
              <div className="p-4 rounded-lg h-full overflow-y-scroll">
                <div className="overflow-auto h-full font-mono text-sm p-2 rounded">
                  <SyntaxHighlighter
                    language={
                      currentfile.endsWith(".js")
                        ? "javascript"
                        : currentfile.endsWith(".json")
                        ? "json"
                        : "text"
                    }
                    style={vscDarkPlus}
                    customStyle={{
                      backgroundColor: "transparent",
                      padding: 0,
                      margin: 0,
                      overflow: "auto",
                      height: "100%",
                    }}
                    wrapLines={true}
                    showLineNumbers={true}
                    lineNumberStyle={{ color: "#6e7681", marginRight: "1em" }}
                    lineProps={{ style: { whiteSpace: "pre-wrap" } }}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      let updatedFiles = {
                        ...files.filetree,
                        [currentfile]: {
                          file: {
                            contents: e.target.textContent,
                          },
                        },
                      };
                      // console.log("updatedFiles", updatedFiles);

                      setFiles((prev) => ({ ...prev, filetree: updatedFiles }));

                      updateFiletree(updatedFiles);
                    }}
                  >
                    {files.filetree[currentfile]?.file?.contents || ""}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}
          </div>
          {iframeUrl && webContainer && (
            <div className="flex min-w-96 flex-col h-screen">
              <div>
                <div className="address-bar p-2">
                  <input
                    type="text"
                    onChange={(e) => setIframeUrl(e.target.value)}
                    value={iframeUrl}
                    className="w-full h-8 p-2 px-4 bg-light-background dark:bg-dark-background rounded-full border border-gray-300 dark:border-gray-600 text-sm"
                  />
                </div>
              </div>
              <iframe src={iframeUrl} className="w-full h-full"></iframe>
            </div>
          )}
        </div>
      )}

      {/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Users Drawer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } rounded-r-md shadow-lg border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            <h3 className="text-lg font-semibold font-sans text-gray-900 dark:text-white">
              Collaborators
            </h3>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaTimes size={20} />
            </button>
          </div>
          {project?.users?.map((user, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-md transition-colors cursor-pointer">
                <FaUserFriends size={25} />
                <div className="flex items-center justify-between w-full p-2">
                  <span className="truncate text-gray-900 dark:text-white">
                    {user.email ? user.email.split("@")[0] : "Unknown User"}
                  </span>

                  <button
                    onClick={() => {
                      removeuserFromProject(user._id);
                    }}
                    className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    {user._id !== project.users[0]._id ? <FaTimes /> : null}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewCreatedProject;
