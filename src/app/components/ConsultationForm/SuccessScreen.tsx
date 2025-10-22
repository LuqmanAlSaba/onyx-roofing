"use client";

import React from "react";
import { motion } from "framer-motion";

type SuccessScreenProps = {
    onClose: () => void;
};

export default function SuccessScreen({ onClose }: SuccessScreenProps) {
    return (
        <motion.div
            key="success-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { type: "spring", stiffness: 300, damping: 25, delay: 0.1 }
            }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="text-center"
            aria-live="polite"
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.2 }
                }}
                className="w-16 h-16 bg-[#13a19c]/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
                <svg
                    className="w-8 h-8 text-[#13a19c]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </motion.div>
            <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 0.3, delay: 0.3 } }}
                className="text-xl sm:text-2xl font-semibold text-white mb-2"
            >
                Request Booked!
            </motion.h3>
            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 0.3, delay: 0.4 } }}
                className="text-gray-400 mb-6 text-sm sm:text-base"
            >
                We'll be in touch shortly to confirm your consultation details.
            </motion.p>
            <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{
                    y: 0,
                    opacity: 1,
                    transition: { type: "spring", stiffness: 300, damping: 25, delay: 0.5 }
                }}
                onClick={onClose}
                className="w-full px-6 py-3 bg-[#13a19c] hover:bg-[#0f7a76] text-white rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
            >
                Return to Home
            </motion.button>
        </motion.div>
    );
}
