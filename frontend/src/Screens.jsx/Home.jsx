import React, { useState, useEffect, useContext } from "react";
import { RiLinksFill, RiUserFill } from "@remixicon/react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axios.config.js";
import { userContext } from "../Context/UsercontextProvider.jsx";
import { Sun, Moon } from "lucide-react";

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const { user, setUser, theme, setTheme } = useContext(userContext);

  useEffect(() => {
    axios
      .get("projects/allProjects")
      .then((response) => {
        setProjects(response.data.Current_User_All_Projects || []);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  async function createProject() {
    try {
      const response = await axios.post("projects/create", {
        name: projectName,
      });
      navigate(`/project/${response.data._id}`);
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error creating project. Please try again.");
    }
  }

  const handleLogout = async () => {
    try {
      await axios.get("/users/logout");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 to-gray-100"
      }`}
    >
      <header className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-sans bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent">
            CollabSphere
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <RiUserFill size={18} className="text-gray-600 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user && user.email ? user.email.split("@")[0] : "User"}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold font-sans text-gray-900 dark:text-white mb-2">
              Your Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-accent-light text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by creating your first project
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-primary hover:bg-accent-light text-white font-medium py-2 px-6 rounded-lg shadow-md transition-all duration-200"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent-light rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold font-sans mb-2 text-gray-900 dark:text-white truncate">
                  {project.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <RiUserFill size={16} />
                  <span>
                    {project.users.length}{" "}
                    {project.users.length === 1 ? "collaborator" : "collaborators"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 transform transition-all">
            <h3 className="text-2xl font-bold font-sans mb-2 text-gray-900 dark:text-white">
              Create New Project
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Start a new collaborative project
            </p>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="w-full p-3 mb-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-all"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                disabled={!projectName.trim()}
                className="px-5 py-2.5 bg-primary hover:bg-accent-light text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
