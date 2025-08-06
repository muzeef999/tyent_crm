// components/ui/Offcanvas.tsx
"use client";
import { AnimatePresence, motion, Variants } from "framer-motion";
import React from "react";


interface OffcanvasProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const backdropVariants : Variants  = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(1px)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const panelVariants : Variants  = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as [number, number,number,number], // custom cubic bezier = smoother
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.76, 0, 0.24, 1] as [number, number,number,number],
    },
  },
};

const Offcanvas: React.FC<OffcanvasProps> = ({ show, onClose, title = "Details", children }) => {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/60 backdrop-blur-none z-40"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            className="fixed top-0 right-0 w-full sm:w-[800px] h-full bg-white z-50 shadow-xl p-6 overflow-y-auto rounded-l-2xl"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="text-red-600 font-semibold hover:opacity-70 transition"
              >
                Close
              </button>
            </div>
            <hr/>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Offcanvas;
