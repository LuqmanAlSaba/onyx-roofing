'use client';

import { Share2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShareButton({ title }: { title: string }) {
    const [copied, setCopied] = useState(false);
    const [url, setUrl] = useState('');

    // Get URL on client side to avoid SSR issues
    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    const handleShare = async () => {
        if (!url) return; // Don't share if URL isn't ready

        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    return (
        <motion.button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white hover:border-[#40d6d1]/50 transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <AnimatePresence mode="wait">
                {copied ? (
                    <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-2 text-[#40d6d1]"
                    >
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-medium">Copied!</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="share"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-2"
                    >
                        <Share2 className="w-4 h-4 group-hover:text-[#40d6d1] transition-colors" />
                        <span className="text-sm font-light">Share</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
