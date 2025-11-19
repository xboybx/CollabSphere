import React from "react";
import { FaTimes, FaUserFriends, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

//Side Bar wich comes when clicked the Fauser icon
//wher it shows all users present in the current project
const CollaboratorsPanel = ({
  isOpen,
  onClose,
  collaborators,
  onRemoveCollaborator,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0 left-0 h-full bg-gray-800 w-80 p-6 rounded-r-md shadow-lg z-50 border-r border-gray-700 flex flex-col"
        >
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
            <h3 className="text-lg font-semibold font-sans text-white">
              Collaborators
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-700"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto">
            {collaborators?.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between gap-3 hover:bg-gray-700 p-2 rounded-md transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <FaUserFriends size={16} />
                  </div>
                  <span className="text-white">
                    {user.email ? user.email.split("@")[0] : "Unknown User"}
                  </span>
                </div>
                <button
                  onClick={() => onRemoveCollaborator(user._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-gray-600"
                  title="Remove Collaborator"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollaboratorsPanel;
