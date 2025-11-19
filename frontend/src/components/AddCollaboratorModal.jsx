import React from "react";
import { FaTimes, FaUserFriends } from "react-icons/fa";
import { motion } from "framer-motion";

//This is the Modal to add users to the curren project
//displayes when we plus icon in the header
const AddCollaboratorModal = ({
  allusers,
  project,
  adduserToProject,
  removeuserFromProject,
  setaAllusersModal,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute top-[30%] right-[50%] bg-gray-800 p-6 rounded-md shadow-lg z-50 w-80 border border-gray-700"
    >
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
    </motion.div>
  );
};

export default AddCollaboratorModal;
