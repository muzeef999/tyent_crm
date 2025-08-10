// components/ui/SkeletonRow.tsx
"use client";

import { motion } from "framer-motion";



const rowVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

export default function TableLoading() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, idx) => (
        <motion.tr
          key={idx}
          custom={idx}
          variants={rowVariants as any}
          initial="hidden"
          animate="visible"
          className="border-t"
        >
          <td colSpan={9} className="px-4 py-3">
            <div className="h-6 w-full rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
          </td>
        </motion.tr>
      ))}
    </>
  );
}
