// src/components/Ham8Toggle.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Hamburger() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <motion.svg
      onClick={() => setIsOpen(o => !o)}
      viewBox="0 0 100 100"
      width="32"
      height="32"
      style={{ originX: "50%", originY: "50%", cursor: "pointer" }}
      animate={{ rotate: isOpen ? 45 : 0 }}
      transition={{ rotate: { duration: 0.4, ease: "easeInOut" } }}
    >
      {/* Top line */}
      <motion.path
        d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20"
        fill="none"
        stroke="#fff"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeDasharray="40 160"
        animate={{ strokeDashoffset: isOpen ? -64 : 0 }}
        transition={{ strokeDashoffset: { duration: 0.4, ease: "easeInOut" } }}
      />

      {/* Middle line */}
      <motion.path
        d="m 30,50 h 40"
        fill="none"
        stroke="#fff"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeDasharray="40 142"
        style={{ originX: "50%", originY: "50%" }}
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ rotate: { duration: 0.4, ease: "easeInOut" } }}
      />

      {/* Bottom line */}
      <motion.path
        d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20"
        fill="none"
        stroke="#fff"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeDasharray="40 85"
        animate={{ strokeDashoffset: isOpen ? -64 : 0 }}
        transition={{ strokeDashoffset: { duration: 0.4, ease: "easeInOut" } }}
      />
    </motion.svg>
  );
}
