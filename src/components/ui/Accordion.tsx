"use client";
import React from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { AccordionProps } from "@/types/customer";

const Accordion: React.FC<AccordionProps> = ({
  title,
  id,
  isOpen,
  onToggle,
  hasError = false,
  children,
}) => {
  return (
    <div
      className={`border rounded-xl mb-4 shadow-sm cursor-pointer ${
        isOpen ? "border-primary" : "border-gray-300"
      } ${hasError ? "border-red-500" : isOpen ? "border-green-500" : ""}`}
    >
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex justify-between items-center w-full px-4 py-3 text-left font-medium text-gray-800"
      >
        {title}
        <FiChevronDown
          className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-4 pb-4 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
