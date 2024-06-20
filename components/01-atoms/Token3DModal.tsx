import React from "react";
import cc from "classcat";

interface Token3DModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Token3DModal = ({ isOpen, onClose }: Token3DModalProps) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 w-full h-full z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 cursor-default"
          role="button"
          onClick={onClose}
        />
      )}
      <div
        className={cc([
          "fixed z-50 flex justify-center items-center transition-transform duration-300 ease-in-out p-6",
          "rounded-[20px] border dark:bg-[#212322] dark:border-[#353836] dark:shadow-sidebarDark bg-[#F6F6F6] border-[#F0EEEE] shadow-sidebarLight",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full",
          "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        ])}
      >
        <div className="flex flex-col gap-6">Conteúdo do Modal</div>
      </div>
    </>
  );
};
