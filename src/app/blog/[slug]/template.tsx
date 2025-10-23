"use client";

import { motion } from "framer-motion";

export default function BlogPostTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      }}
      style={{
        position: "relative",
        minHeight: "100vh",
        willChange: "opacity",
      }}
    >
      {children}
    </motion.div>
  );
}
