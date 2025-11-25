import React from "react";
import { FaUsers, FaPlus } from "react-icons/fa";
import { Sun, Moon, Code2, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({
  user,
  project,
  isCodeEditorVisible,
  setIsCodeEditorVisible,
  setaAllusersModal,
  getallUsers,
  toggleTheme,
  theme,
  setIsCollaboratorsDrawerOpen,
}) => {
  const navigate = useNavigate();

  return (
    <div className="h-16 flex items-center px-1 justify-between rounded-t-md border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        {/* <button
          onClick={() => navigate("/home")}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none"
          title="Back to Home"
        >
          <Home size={20} />
        </button> */}
        <button
          onClick={() => setIsCollaboratorsDrawerOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 focus:outline-none"
        >
          <FaUsers size={20} />
          <div className="text-sm font-medium font-sans">
            {` ${user && user.email ? user.email.split("@")[0] : "User"}`}
          </div>
        </button>
      </div>

      <h2 className="text-2xl font-bold  text-white">
        {project?.name || "Project"}
      </h2>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsCodeEditorVisible(!isCodeEditorVisible)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors focus:outline-none"
          title={isCodeEditorVisible ? "Hide Code Editor" : "Show Code Editor"}
        >
          <Code2 size={13} />
          {/* <span className="text-sm">
            {isCodeEditorVisible ? "Hide" : "Show"}
          </span> */}
        </button>
        <button
          onClick={() => {
            setaAllusersModal(true);
            getallUsers();
          }}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none"
          title="Add Collaborator"
        >
          <FaPlus />
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
  );
};

export default Header;
