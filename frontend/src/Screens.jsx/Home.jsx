import React, { useState, useEffect, useContext } from "react";
import { RiLinksFill, RiUserFill } from "@remixicon/react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axios.config.js";
import { userContext } from "../Context/usercontextProvider.jsx";

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [projectName, setprojectName] = useState("");
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext);

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

  async function createProject(e) {
    try {
      const response = await axios.post("projects/create", {
        name: projectName,
      });
      navigate("/newcreatedproject", { state: { project: response.data } });
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

  return (
    <>
      <div className="min-h-screen bg-white p-8 relative font-sans">
        {/* Logout Button */}
        <div className=" font-semibold">
          {` Welcome,${user && user.email ? user.email.split("@")[0] : "User"}`}
        </div>
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 px-5 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-lg font-semibold shadow transition duration-300"
        >
          Logout
        </button>
        {/* Header */}
        <header className="mb-10 text-center text-gray-900">
          <h1 className="text-4xl font-extrabold mb-2">
            Your Projects Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Create new projects or manage your existing ones below.
          </p>
        </header>
        {/* New Project Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-3 bg-gray-900 text-white font-bold px-6 py-3 rounded-full shadow hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
          >
            <RiLinksFill size={24} />
            New Project
          </button>
        </div>
        {/* Projects Grid */}
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {projects.length === 0 && (
            <p className="text-gray-700 col-span-full text-center text-xl">
              No projects found. Create a new project to get started!
            </p>
          )}
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() =>
                navigate("/newcreatedproject", { state: { project } })
              }
              className="cursor-pointer bg-gray-100 rounded-xl p-6 shadow hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 truncate">
                {project.name}
              </h2>
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <RiUserFill size={20} />
                <span>
                  {project.users.length} Collaborator
                  {project.users.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ))}
        </main>
        {/* Modal */}
        {modalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-8 w-96 max-w-full shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Create New Project
              </h3>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setprojectName(e.target.value)}
                placeholder="Project Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 mb-6"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createProject()}
                  className="px-5 py-2 rounded-md bg-gray-900 text-white font-semibold hover:bg-gray-700 transition"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;

// import React, { useState, useEffect } from "react";
// import {
//   RiLinksFill,
//   RiUser2Fill,
//   RiUser4Fill,
//   RiUserFill,
//   RiUserFollowFill,
// } from "@remixicon/react";
// import { useNavigate } from "react-router-dom";
// import axios from "../../config/axios.config.js";

// const Home = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [projectName, setprojectName] = useState("");
//   const [projects, setProjects] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get("projects/allProjects")
//       .then((response) => {
//         console.log("Current User Projects: ", response.data);
//         setProjects(response.data.Current_User_All_Projects || []);
//       })
//       .catch((error) => {
//         console.error("Error fetching projects:", error);
//       });
//   }, []);

//   async function createProject(e) {
//     try {
//       const response = await axios.post("projects/create", {
//         name: projectName,
//       });
//       console.log(response.data);
//       navigate("/newcreatedproject", { state: { project: response.data } });
//       setModalOpen(false);
//     } catch (error) {
//       console.error(error);
//       alert("Error creating project. Please try again.");
//     }
//   }

//   return (
//     <>
//       <div className="h-screen w-screen  bg-slate-400 p-4 relative">
//         {/* New Project Button */}
//         <div
//           className="absolute   top-4 left-4 h-14 w-40 bg-gray-500 hover:bg-gray-600 text-white p-3 text-center rounded-md font-semibold font-mono flex justify-center items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-105"
//           onClick={() => setModalOpen(true)}
//         >
//           New Project
//           <RiLinksFill />
//         </div>

//         {/* Projects List */}
//         <div className="flex  gap-4 mt-20">
//           {projects?.map((project) => {
//             return (
//               <div
//                 key={project._id}
//                 className="w-max h-max bg-gray-500 hover:bg-gray-600 text-white p-6 rounded-md font-semibold font-mono  justify-center items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-105"
//                 onClick={() =>
//                   navigate("/newcreatedproject", { state: { project } })
//                 }
//               >
//                 {project.name}

//                 <p className="flex items-center gap-2 mt-2">
//                   <RiUserFill />:{project.users.length}
//                 </p>
//               </div>
//             );
//           })}
//         </div>

//         {/* Modal */}
//         {modalOpen && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 animate-fade-in"
//             onClick={() => setModalOpen(false)} // Close modal on background click
//           >
//             <div
//               className="h-1/3 w-1/3 bg-gray-700 rounded-md flex flex-col gap-4 shadow-lg transform transition-transform duration-300 scale-95 animate-scale-in"
//               onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
//             >
//               {/* Modal Header */}
//               <label className="bg-white h-14 mb-5 text-center pt-5 font-extrabold text-gray-500 rounded-t-md">
//                 Enter Project Name
//               </label>

//               {/* Input Area */}
//               <div className="p-4">
//                 <input
//                   onChange={(e) => setprojectName(e.target.value)}
//                   value={projectName}
//                   placeholder="Project Name"
//                   className="p-2 rounded-md w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
//                 />
//                 <div className="flex items-center justify-center gap-4 mt-4">
//                   {/* Cancel Button */}
//                   <button
//                     className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md w-full transition-transform duration-300 hover:scale-105"
//                     onClick={() => setModalOpen(false)}
//                   >
//                     Cancel
//                   </button>
//                   {/* Create Button */}
//                   <button
//                     className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md w-full transition-transform duration-300 hover:scale-105"
//                     onClick={() => createProject()}
//                   >
//                     Create
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Home;
