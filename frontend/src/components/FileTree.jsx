import React from "react";
import { FaFolder, FaFolderOpen, FaFile } from "react-icons/fa";

const FileTree = ({ files, onFileClick }) => {
  const renderFileTree = (tree, path = "") => {
    return Object.entries(tree).map(([name, content]) => {
      const currentPath = path ? `${path}/${name}` : name;
      if (content.file) {
        return (
          <div
            key={currentPath}
            onClick={() => onFileClick(currentPath, content.file.contents)}
            className="flex items-center gap-2 cursor-pointer p-1 rounded-md hover:bg-gray-700"
          >
            <FaFile className="text-gray-400" />
            <span>{name}</span>
          </div>
        );
      } else if (content.directory) {
        return (
          <details key={currentPath} open>
            <summary className="flex items-center gap-2 cursor-pointer p-1 rounded-md hover:bg-gray-700">
              <FaFolder className="text-yellow-500" />
              <span>{name}</span>
            </summary>
            <div className="pl-4 border-l border-gray-700">
              {renderFileTree(content.directory, currentPath)}
            </div>
          </details>
        );
      }
      return null;
    });
  };

  return (
    <div className="h-full bg-gray-800 text-white p-4 overflow-y-auto border border-gray-700 rounded-md">
      {renderFileTree(files.filetree)}
    </div>
  );
};

export default FileTree;
