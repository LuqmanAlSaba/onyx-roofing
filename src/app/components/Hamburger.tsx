// src/components/Hamburger.tsx
import React from "react";
import { motion } from "framer-motion";

export type HamburgerProps = {
  isOpen: boolean;
  onToggle: () => void;
  size?: number;
  stroke?: string;
};

export default function Hamburger({ isOpen, onToggle, size = 32, stroke = "#fff" }: HamburgerProps) {
  return (
    <motion.svg
      onClick={onToggle}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ cursor: "pointer", transformOrigin: "50% 50%" }}
      animate={{ rotate: isOpen ? 45 : 0 }}
      transition={{ rotate: { duration: 0.4, ease: "easeInOut" } }}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      role="button"
    >
      {/* Top line */}
      <motion.path
        d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20"
        fill="none"
        stroke={stroke}
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
        stroke={stroke}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeDasharray="40 142"
        style={{ transformOrigin: "50% 50%" }}
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ rotate: { duration: 0.4, ease: "easeInOut" } }}
      />

      {/* Bottom line */}
      <motion.path
        d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20"
        fill="none"
        stroke={stroke}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeDasharray="40 85"
        animate={{ strokeDashoffset: isOpen ? -64 : 0 }}
        transition={{ strokeDashoffset: { duration: 0.4, ease: "easeInOut" } }}
      />
    </motion.svg>
  );
}
