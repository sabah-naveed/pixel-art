import React from "react";
import { Loader2, Sparkles } from "lucide-react";

const LoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto">
              <Loader2 className="w-full h-full text-primary-500 animate-spin" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-secondary-500 animate-pulse" />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Processing Your Image
          </h3>

          <p className="text-gray-600 mb-6">This may take a few seconds...</p>

          <div className="flex justify-center space-x-2">
            <div
              className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-secondary-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-success-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
