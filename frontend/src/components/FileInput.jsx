import React from "react";

const FileInput = ({ setSelectedFile }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileChange}
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer flex flex-col items-center"
      >
        <div className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <span className="text-6xl text-gray-400">+</span>
        </div>
        <span id="fileLabel" className="text-gray-700 mt-2">
          Choose Image
        </span>
      </label>
    </div>
  );
};

export default FileInput;
