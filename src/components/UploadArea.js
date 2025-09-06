import React, { useRef, useState } from "react";
import { Upload, Cloud, X } from "lucide-react";

const UploadArea = ({ onFileSelect }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];

      // Validate file type before showing preview
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp",
      ];

      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);

        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        onFileSelect(file);
      } else {
        // Clear any previous selection
        clearSelection();
        // Let the parent component handle the error
        onFileSelect(file);
      }
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];

      // Validate file type before showing preview
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp",
      ];

      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);

        // Create preview URL with proper orientation
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        onFileSelect(file);
      } else {
        // Clear any previous selection
        clearSelection();
        // Let the parent component handle the error
        onFileSelect(file);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!selectedFile ? (
        <div
          className={`upload-area ${isDragOver ? "dragover" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="text-center flex flex-col items-center justify-center h-full">
            <div className="mb-6">
              {isDragOver ? (
                <Cloud className="h-16 w-16 text-success-500 mx-auto animate-bounce-gentle" />
              ) : (
                <Upload className="h-16 w-16 text-primary-500 mx-auto" />
              )}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {isDragOver
                ? "Drop your image here"
                : "Drag & Drop Your Image Here"}
            </h3>
            <p className="text-gray-600 mb-6">or click to browse</p>
            <button
              type="button"
              className="btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <Upload className="h-5 w-5 mr-2" />
              Choose Image
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Selected Image</h3>
              <button
                onClick={clearSelection}
                className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-lg"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="text-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto max-h-64 rounded-lg shadow-lg mx-auto mb-4"
                style={{ imageOrientation: "from-image" }}
              />
              <p className="text-sm text-gray-600 mb-4">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Supports JPEG, PNG, GIF, BMP, WebP • Max 16MB
        </p>
      </div>
    </div>
  );
};

export default UploadArea;
