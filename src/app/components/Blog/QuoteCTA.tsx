'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface QuoteCTAProps {
    onOpenForm?: () => void;
    title?: string;
    description?: string;
    buttonText?: string;
}

export default function QuoteCTA({
    onOpenForm,
    title = "Ready to Upgrade Your Roof?",
    description = "Get a free, detailed quote from Onyx Roofing today. We'll help you choose the perfect materials for your home and budget.",
    buttonText = "Get a Free Quote"
}: QuoteCTAProps) {
    return (
        <section className="my-16 relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#1a1f1a]">
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 p-8 md:p-12 flex flex-col items-start gap-6">
                <div className="max-w-3xl text-left">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-thin text-white mb-4 tracking-tight leading-tight">
                        {title}
                    </h3>
                    <p className="text-white/60 text-base md:text-lg leading-relaxed font-light">
                        {description}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {onOpenForm ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onOpenForm}
                            className="group relative flex items-center justify-center gap-3 px-8 py-3 rounded-full bg-[#40d6d1] text-[#1a1f1a] transition-all duration-500 hover:bg-[#3bc2bd] shadow-[0_0_30px_-5px_rgba(64,214,209,0.3)] hover:shadow-[0_0_50px_-5px_rgba(64,214,209,0.5)] overflow-hidden"
                        >
                            <span className="text-lg font-medium relative z-10">{buttonText}</span>
                            <ArrowRight className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />

                            {/* Hover effect overlay */}
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                        </motion.button>
                    ) : (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link
                                href="/contact"
                                className="group relative flex items-center justify-center gap-3 px-8 py-3 rounded-full bg-[#40d6d1] text-[#1a1f1a] transition-all duration-500 hover:bg-[#3bc2bd] shadow-[0_0_30px_-5px_rgba(64,214,209,0.3)] hover:shadow-[0_0_50px_-5px_rgba(64,214,209,0.5)] overflow-hidden"
                            >
                                <span className="text-lg font-medium relative z-10">{buttonText}</span>
                                <ArrowRight className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />

                                {/* Hover effect overlay */}
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                            </Link>
                        </motion.div>
                    )}

                    <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href="tel:5022073007"
                        className="group flex items-center justify-center gap-3 px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/5 transition-all duration-300"
                    >
                        <svg className="w-5 h-5 text-[#40d6d1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-lg font-medium">502-207-3007</span>
                    </motion.a>
                </div>
            </div>
        </section>
    );
}
