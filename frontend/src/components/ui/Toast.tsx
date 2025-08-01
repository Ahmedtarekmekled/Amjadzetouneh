import { Fragment, useEffect } from "react";
import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface ToastProps {
  show: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export default function Toast({ show, type, message, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm mx-auto sm:mx-0">
        <div 
          className="bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
          style={{ minWidth: '300px', maxWidth: '90vw' }}
        >
          <div className="p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {type === "success" ? (
                  <CheckCircleIcon 
                    className="h-6 w-6 text-green-400" 
                    aria-hidden="true" 
                  />
                ) : (
                  <XCircleIcon 
                    className="h-6 w-6 text-red-400" 
                    aria-hidden="true" 
                  />
                )}
              </div>
              <div className="flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900 break-words">
                  {message}
                </p>
              </div>
              <div className="flex-shrink-0 flex">
                <button
                  onClick={onClose}
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
