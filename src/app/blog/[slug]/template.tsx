"use client";

import { motion } from "framer-motion";

export default function BlogPostTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: {
          y: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
          opacity: { duration: 0.4, ease: "easeOut" }
        }
      }}
      exit={{
        y: "100%",
        opacity: 0,
        transition: {
          duration: 0.4,
          ease: [0.32, 0.72, 0, 1]
        }
      }}
      style={{
        position: "relative",
        minHeight: "100vh",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
}
