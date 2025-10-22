"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type ServiceSelectorProps = {
    services: string[];
    selectedServices: string[];
    onToggle: (service: string) => void;
};

const availableServices = [
    "Shingle Repair",
    "Roof Inspection",
    "Complete Replacement",
    "Storm Damage",
    "Leak Repair",
    "Emergency Service"
];

export default function ServiceSelector({ selectedServices, onToggle }: ServiceSelectorProps) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-300 mb-4">
                Services Needed
            </label>
            <motion.div layout className="grid grid-cols-2 gap-2" style={{ textAlign: "left" }}>
                {availableServices.map((service) => {
                    const selected = selectedServices.includes(service);
                    return (
                        <motion.button
                            key={service}
                            layout
                            type="button"
                            onClick={() => onToggle(service)}
                            className={`relative overflow-visible w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border shadow-sm ${
                                selected
                                    ? "bg-[#5c9c5f]/50 text-[#fefefe] border-[#a1b5a1]/50"
                                    : "bg-[#2d2f34] text-gray-300 border-[#4a4f55] hover:bg-[#383b40]"
                            }`}
                        >
                            {service === "Roof Inspection" && (
                                <span
                                    className="absolute px-2 py-0 text-[11px] font-semibold bg-[#c78a36]/60 text-white/80"
                                    style={{
                                        borderRadius: "2px 2px 0 0",
                                        top: "-17px",
                                        right: "8px",
                                        boxShadow: "inset 0 -4px 8px -4px rgba(0,0,0,0.9)"
                                    }}
                                >
                                    Popular
                                </span>
                            )}
                            <span>{service}</span>
                            <AnimatePresence initial={false} mode="wait">
                                {selected && (
                                    <motion.span
                                        key="check"
                                        initial={{ scale: 0.5, opacity: 0, rotate: -64 }}
                                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                        exit={{ scale: 0.5, opacity: 0, rotate: 32 }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        className="ml-2 w-5 h-5 flex items-center justify-center rounded-full bg-[#3f8c42]"
                                    >
                                        <svg
                                            className="w-3 h-3 text-[#fefefe]"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
}
