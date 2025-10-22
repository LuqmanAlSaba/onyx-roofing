"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type ErrorNotificationProps = {
    message: string | null;
    onClose: () => void;
};

export default function ErrorNotification({ message, onClose }: ErrorNotificationProps) {
    React.useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 8000); // Auto-dismiss after 8 seconds
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                    role="alert"
                    aria-live="assertive"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <svg
                                className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-red-300">Error</p>
                                <p className="text-xs text-red-200 mt-1">{message}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            aria-label="Close error notification"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
