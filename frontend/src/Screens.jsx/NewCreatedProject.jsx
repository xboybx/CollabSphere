import React, { useState, useCallback, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axios.config.js";
import {
  socketInstance,
  sendMessage,
  receiveMessage,
  removeMessageListener,
} from "../Context/SocketContext.jsx";
import { userContext } from "../Context/UsercontextProvider.jsx";
import { RingLoader } from "react-spinners";
import { getWebContainer } from "../../config/Webcontainer.js";
import Header from "../components/Header.jsx";
import Chat from "../components/Chat.jsx";
import FileTree from "../components/FileTree.jsx";
import CodeEditor from "../components/Editor.jsx";
import AddCollaboratorModal from "../components/AddCollaboratorModal.jsx";
import CollaboratorsPanel from "../components/CollaboratorsPanel.jsx";
import SidePanel from "../components/SidePanel";
import { AnimatePresence } from "framer-motion";

const NewCreatedProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [webContainer, setWebContainer] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [runProcess, setRunProcess] = useState(null);

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
  const [isCollaboratorsDrawerOpen, setIsCollaboratorsDrawerOpen] =
    useState(false);

  useEffect(() => {
    if (projectId) {
      socketInstance(projectId);

      const geminiErrorHandler = (error) => {
        setGeminiError(error.message);
        setIsLoading(false);
      };

      const aiResponseEndHandler = () => {
        console.log("response received");
        setIsLoading(false);
      };

      const messageHandler = (data) => {
        let aiMessage = data.message;
        if (data.sender._id === "ai") {
          try {
            const parsedMessage = JSON.parse(data.message);
            if (parsedMessage?.fileTree) {
              if (webContainer) {
                webContainer.mount(parsedMessage.fileTree);
              }
              setFiles((prevFiles) => ({
                ...prevFiles,
                filetree: parsedMessage.fileTree,
              }));
            }
            aiMessage = parsedMessage.text || data.message;
          } catch (e) {
            // Not a JSON message, use as is
          }
        }
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: aiMessage, sender: data.sender },
        ]);
      };

      receiveMessage("gemini-error", geminiErrorHandler);
      receiveMessage("ai-response-end", aiResponseEndHandler);
      receiveMessage("project-message", messageHandler);

      // Cleanup listeners on component unmount or projectId change
      return () => {
        removeMessageListener("gemini-error", geminiErrorHandler);
        removeMessageListener("ai-response-end", aiResponseEndHandler);
        removeMessageListener("project-message", messageHandler);
      };
    }
  }, [projectId, webContainer]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.trim()) {
      sendMessage("project-message", {
        message: message,
        sender: user._id,
      });
      // console.log("message from ai through sockrt to frontend", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: user._id },
      ]);
      setMessage("");
      // Only set loading when message is for AI
      if (message.includes("@ai")) {
        setIsLoading(true);
        setGeminiError(false);
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

    //Creating a webcontainer instance
    if (!webContainer) {
      getWebContainer().then(async (instance) => {
        setWebContainer(instance);
        console.log("WebContainer instance created");
        if (project.filetree) {
          await instance.mount(project.filetree);
          setFiles({ filetree: project.filetree });
        }
      });
    }

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);

    return () => {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [project, webContainer, resize, stopResizing]);

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
        <Header
          user={user}
          project={project}
          isCodeEditorVisible={isCodeEditorVisible}
          setIsCodeEditorVisible={setIsCodeEditorVisible}
          setaAllusersModal={setaAllusersModal}
          getallUsers={getallUsers}
          toggleTheme={toggleTheme}
          theme={theme}
          setIsCollaboratorsDrawerOpen={setIsCollaboratorsDrawerOpen}
        />

        <AnimatePresence>
          {allusersmodal && (
            <AddCollaboratorModal
              allusers={allusers}
              project={project}
              adduserToProject={adduserToProject}
              removeuserFromProject={removeuserFromProject}
              setaAllusersModal={setaAllusersModal}
            />
          )}
        </AnimatePresence>

        <Chat
          messages={messages}
          user={user}
          geminiError={geminiError}
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          theme={theme}
        />
      </div>
      <div
        onMouseDown={startResizing}
        className="w-2 cursor-col-resize bg-gray-700 hover:bg-primary transition-colors"
      />
      {isCodeEditorVisible && (
        <div
          className="flex flex-col"
          style={{ width: `${100 - leftPaneWidth}%` }}
        >
          <SidePanel
            files={files}
            currentfile={currentfile}
            setCurrentfile={setCurrentfile}
            webContainer={webContainer}
            runProcess={runProcess}
            setRunProcess={setRunProcess}
            setIframeUrl={setIframeUrl}
            updateFiletree={updateFiletree}
            theme={theme}
          />
          {/* //the Browser output of the web container  */}
          {iframeUrl && (
            <div className="h-1/2 border-t border-gray-700 flex flex-col">
              <div className="bg-gray-800 flex items-center p-2">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 ml-4 bg-gray-700 rounded-md px-2 py-1 text-sm text-gray-300">
                  {iframeUrl}
                </div>
              </div>
              <iframe
                src={iframeUrl}
                className="w-full h-full bg-white"
                title="Preview"
              ></iframe>
            </div>
          )}
        </div>
      )}
      <CollaboratorsPanel
        isOpen={isCollaboratorsDrawerOpen}
        onClose={() => setIsCollaboratorsDrawerOpen(false)}
        collaborators={project?.users}
        onRemoveCollaborator={removeuserFromProject}
      />
    </div>
  );
};

export default NewCreatedProject;
