import React from "react";
import { IoMdClose } from "react-icons/io";

const Modal: React.FC<{
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}> = ({ title, isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div
      tabIndex={-1}
      aria-hidden={!isOpen}
      className="fixed top-[340px] right-0 left-0 z-50 flex justify-center items-center"
    >
      <div
        className="fixed inset-0 bg-black dark:bg-white opacity-50 h-screen"
        onClick={onClose}
      />
      <div className="relative dark:bg-boxdark shadow dark:bg-gray-800 m-4 p-4 lg:w-2/5 w-180 lg:min-w-[30%] lg:max-w-[30%] rounded-lg bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between p-2 rounded-t">
          <h3 className="lg:text-xl text-base font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={onClose}
            aria-label="Close modal"
          >
            <IoMdClose className="w-6 h-6 ml-2" />
          </button>
        </div>
        <div className="flex justify-start items-start p-4 md:p-5 rounded-b">
          <button
            type="button"
            className="text-white bg-[#623de7] hover:bg-[#623de7] focus:ring-4 focus:outline-none focus:ring-[#623de7] font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#623de7] dark:hover:bg-[#623de7] dark:focus:ring-[#623de7]"
            onClick={onSave}
          >
            Yes
          </button>
          <button
            type="button"
            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:bg-gray-700 dark:text-black dark:border-gray-600 dark:hover:text-black dark:hover:bg-gray-600"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
