import React, { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const Message = ({ type, text, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "error":
        return <XCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-r from-success-500 to-success-400 text-white";
      case "error":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white";
      default:
        return "bg-gradient-to-r from-primary-500 to-secondary-500 text-white";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full animate-slide-up`}
    >
      <div className={`${getStyles()} rounded-lg shadow-lg p-4`}>
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">{getIcon()}</div>
          <div className="flex-1">
            <p className="text-sm font-medium">{text}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-3 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
