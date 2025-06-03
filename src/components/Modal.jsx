import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export function Modal({ isOpen, onClose, title, children, type = "info" }) {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  if (!visible) return null;

  const typeClasses = {
    info: "bg-blue-100 border-blue-400 text-blue-700",
    success: "bg-green-100 border-green-400 text-green-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    error: "bg-red-100 border-red-400 text-red-700",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`border-l-4 rounded-lg shadow-lg bg-white w-full max-w-md ${typeClasses[type]}`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">{title}</h3>
            <button 
              onClick={() => {
                setVisible(false);
                onClose();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="py-2">{children}</div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setVisible(false);
                onClose();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}