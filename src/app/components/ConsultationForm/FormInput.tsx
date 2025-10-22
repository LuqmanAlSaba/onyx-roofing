"use client";

import React from "react";
import { motion, useAnimationControls } from "framer-motion";

type FormInputProps = {
    label: string;
    name: string;
    type?: "text" | "email" | "tel" | "textarea";
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    error?: boolean;
    errorMessage?: string;
    controls?: ReturnType<typeof useAnimationControls>;
    rows?: number;
    autoComplete?: string;
    className?: string;
};

export default function FormInput({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    error = false,
    errorMessage,
    controls,
    rows = 3,
    autoComplete,
    className = "",
}: FormInputProps) {
    const inputClassName = `w-full px-3 py-2 bg-[#3a3f45] border ${
        error ? "border-red-500" : "border-[#4a4f55]"
    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`;

    return (
        <motion.div animate={controls} className="w-full">
            <label className="block text-xs font-medium text-gray-300 mb-1">
                {label}
            </label>
            {type === "textarea" ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows={rows}
                    placeholder={placeholder}
                    className={`${inputClassName} resize-none`}
                    aria-invalid={error}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    className={inputClassName}
                    aria-invalid={error}
                />
            )}
            <div className="h-1">
                {error && errorMessage && (
                    <p className="text-xs text-red-400">{errorMessage}</p>
                )}
            </div>
        </motion.div>
    );
}
