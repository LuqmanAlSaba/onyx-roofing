"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useEdgeSelectedVideo } from "@/hooks/useEdgeSelectedVideo";
import Navigation from "./Navigation";

interface HeroProps {
    isFormOpen?: boolean;
    onOpenForm: () => void;
    initialVideo: string;
}

export default function Hero({ isFormOpen = false, onOpenForm, initialVideo }: HeroProps) {
    // Local UI state
    const [scrolled, setScrolled] = useState(false);
    const [pastVideoSection, setPastVideoSection] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Refs
    const phoneIconRef = useRef<SVGSVGElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Use the Edge-selected video with server-provided initial value
    const currentVideo = useEdgeSelectedVideo(initialVideo);

    // --- Effects
    // Handle video playback when src changes
    useEffect(() => {
        const video = videoRef.current;
        if (video && currentVideo) {
            // When video src changes (e.g., time-based update), restart playback
            const handleLoadedData = () => {
                video.play().catch(() => {
                    // Autoplay might be blocked, ignore error
                });
            };

            video.addEventListener('loadeddata', handleLoadedData);
            return () => video.removeEventListener('loadeddata', handleLoadedData);
        }
    }, [currentVideo]);
    useEffect(() => {
        const setVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty("--vh", `${vh}px`);
        };
        setVh();
        window.addEventListener("resize", setVh);
        return () => window.removeEventListener("resize", setVh);
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const icon = phoneIconRef.current;
        if (!icon) return;
        const interval = setInterval(() => {
            icon.classList.add("wiggle-once");
            setTimeout(() => icon.classList.remove("wiggle-once"), 500);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Optimized scroll effects - batched state updates, fewer re-renders
    useEffect(() => {
        let ticking = false;
        let lastScrolled = false;
        let lastPastVideo = false;

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const y = window.scrollY;
                    const newScrolled = y > 20;
                    const newPastVideo = y > 30;

                    // Only update state if values actually changed
                    if (newScrolled !== lastScrolled || newPastVideo !== lastPastVideo) {
                        lastScrolled = newScrolled;
                        lastPastVideo = newPastVideo;
                        setScrolled(newScrolled);
                        setPastVideoSection(newPastVideo);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);





    // ===== position helper for videos (spread operator) =====
    const getVideoPositionStyles = (src: string | null) => {
        const isHalloween = src === "/videos/house-halloween.mp4";
        return isHalloween
            ? { bottom: 0 as const, top: '-100px' as const, objectPosition: 'center bottom' as const }
            : { top: '0' as const, bottom: 'auto' as const };
    };

    // Convert video path to image path (WebP format)
    // Mobile uses pre-blurred images for better performance
    const getImagePathFromVideo = React.useCallback((videoPath: string) => {
        // /videos/house-afternoon.mp4 -> /images/hero-blurred/house-afternoon.webp (mobile)
        const filename = videoPath.split('/').pop()?.replace('.mp4', '.webp');
        return `/images/hero-blurred/${filename}`;
    }, []);

    // Helper to get the pre-blurred video path
    const getBlurredVideoPath = React.useCallback((videoPath: string) => {
        if (!videoPath) return '';
        const filename = videoPath.split('/').pop();
        if (!filename) return '';

        // Handle cases where the video might already be the blurred version
        // or if it's the snowy one which is named with -blurred in video-selection.ts
        let blurredFilename = filename;
        if (!filename.includes('-blurred')) {
            blurredFilename = filename.replace('.mp4', '-blurred.mp4');
        }

        return `/videos/blurred/${blurredFilename}`;
    }, []);

    return (
        <main
            className="h-full text-white relative overflow-hidden font-inter antialiased"
            style={{
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                border: isMobile ? "8px solid #1a1f1a" : "16px solid #1a1f1a",
                background: "#1a1f1a",
                borderRadius: 0,
                maxWidth: "100vw",
                minHeight: "100vh",
                touchAction: "auto",
            }}
        >
            <div className="relative h-full overflow-hidden" style={{ borderRadius: "32px 32px 0 0", minHeight: "100vh", maxWidth: "100%" }}>


                {/* Blurred, animated video/image background */}
                <motion.div
                    className="absolute inset-0 h-full overflow-hidden"
                    style={{ backgroundColor: "#192119" }}
                    animate={{ scale: scrolled ? 1.02 : 1 }}
                    transition={{ duration: 0.52, ease: "easeOut" }}
                >
                    {/* Mobile: Use static image for better performance. Desktop: Use video */}
                    {isMobile ? (
                        <Image
                            src={getImagePathFromVideo(currentVideo)}
                            alt="Hero background"
                            fill
                            priority
                            quality={85}
                            className="house-background object-cover"
                            style={{
                                filter: "brightness(1) saturate(0.75)",
                                transform: "scale(1.05)",
                                maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.6) 100%)",
                                WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.6) 100%)",
                                ...getVideoPositionStyles(currentVideo),
                            }}
                        />
                    ) : (
                        <motion.video
                            id="heroVideo"
                            ref={videoRef}
                            src={getBlurredVideoPath(currentVideo)}
                            className="house-background absolute w-full h-full object-cover"
                            style={{
                                filter: "saturate(0.75)",
                                transform: "scale(1.08)",
                                left: 0,
                                width: "100%",
                                height: "100%",
                                ...getVideoPositionStyles(currentVideo),
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.0, ease: "easeInOut" }}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            // @ts-expect-error - fetchpriority is valid HTML but not in motion.video types
                            fetchPriority="high"
                            poster=""
                        />
                    )}

                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-black/40" />
                </motion.div>

                {/* NAV + HERO CONTENT */}
                <div className="relative z-100 min-h-screen flex flex-col pb-16 md:pb-0">
                    {/* Navigation */}
                    <Navigation variant="hero" />

                    {/* HERO copy + CTAs */}
                    <section className="relative flex-grow flex flex-col items-center justify-center px-4 sm:px-8 pt-10 md:pt-16 pb-48 md:pb-64">
                        <AnimatePresence mode="wait">
                            {!isFormOpen ? (
                                <motion.div
                                    key="hero-content"
                                    className="relative z-20 text-left mx-auto px-4 max-w-md sm:max-w-lg md:max-w-4xl w-full"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                                    >
                                        <h1
                                            className="text-2xl sm:text-2xl md:text-4xl lg:text-6xl font-light leading-tight"
                                            style={{ textAlign: "left", textShadow: "-0px 0px 3px rgba(0,0,0,.32)" }}
                                        >
                                            <span className="block text-white mb-0 sm:mb-1 tracking-wide" style={{ mixBlendMode: "difference" }}>
                                                Family{" "}
                                                <span className="font-normal" style={{ mixBlendMode: "difference", color: "#40d6d1" }}>
                                                    Built.
                                                </span>
                                            </span>
                                            <span className="block text-white tracking-wide" style={{ mixBlendMode: "difference" }}>
                                                Locally{" "}
                                                <span className="font-normal" style={{ mixBlendMode: "difference", color: "#40d6d1" }}>
                                                    Trusted.
                                                </span>
                                            </span>
                                        </h1>
                                    </motion.div>

                                    <motion.p
                                        className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-white/100 max-w-md sm:max-w-lg md:max-w-2xl leading-relaxed font-light"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                                    >
                                        Your trusted roofing professionals serving St. Matthews, Louisville, and all of Kentucky.
                                        {!isMobile ? " Premium craftsmanship for discerning homeowners." : ""}
                                    </motion.p>

                                    <motion.div
                                        className="mt-4 flex items-center gap-2"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                                    >
                                        <div className="flex text-[#40d6d1]">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-white/90 font-medium text-sm sm:text-base">5-Star Rated Roofing Company</span>
                                    </motion.div>

                                    <motion.div
                                        className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-start items-start"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                                    >
                                        <button
                                            onClick={onOpenForm}
                                            className="group relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-[#13a19c] hover:bg-[#0f7a76] text-white font-normal rounded-full transition-all duration-300 flex items-center cursor-pointer text-sm sm:text-base transform-gpu"
                                        >
                                            <span className="mr-3">Schedule Free Inspection</span>
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </button>

                                        <motion.a
                                            href="#portfolio"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const el = document.getElementById("portfolio");
                                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }}
                                            className="shimmer-effect px-6 sm:px-8 md:px-10 py-3 sm:py-4 border border-white/50 text-white hover:bg-white hover:text-gray-900 font-normal rounded-full transition-all duration-300 cursor-pointer text-sm sm:text-base transform-gpu"
                                        >
                                            View Our Work
                                        </motion.a>
                                    </motion.div>

                                    <motion.div
                                        className="mt-8 sm:mt-16 grid grid-cols-2 sm:flex sm:flex-wrap justify-start items-stretch gap-2 sm:gap-3 text-xs sm:text-sm"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                    >
                                        {["Free Inspection", "St. Matthews Based", "Licensed & Insured", "Family Owned"]
                                            .filter((item) => !(isMobile && (item === "St. Matthews Based" || item === "Family Owned")))
                                            .map((item, index) => (
                                                <motion.span
                                                    key={item}
                                                    className="inline-flex items-center gap-2 text-white/100 font-light px-2 sm:px-3 py-1 sm:py-2 bg-[#474747]/75 backdrop-blur-md h-full transform-gpu"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.35 + index * 0.05, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                                                    style={{ borderRadius: 16, border: "2px solid rgba(200,200,200,0.04)" }}
                                                >
                                                    {item === "St. Matthews Based" ? (
                                                        <svg className="w-4 h-4 text-[#40d6d1]" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ) : item === "Family Owned" ? (
                                                        <svg className="w-4 h-4 text-[#40d6d1]" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : item === "Licensed & Insured" ? (
                                                        <svg className="w-4 h-4 text-[#40d6d1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                        </svg>
                                                    ) : item === "Free Inspection" ? (
                                                        <svg className="w-4 h-4 text-[#40d6d1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                    ) : (
                                                        <span className="text-sm">✓</span>
                                                    )}
                                                    <span>{item}</span>
                                                </motion.span>
                                            ))}
                                    </motion.div>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </section>
                </div>
            </div>

            {/* Call banner */}
            <motion.a
                href="tel:5022073007"
                className="fixed bottom-0 inset-x-0 bg-[#192119] text-white text-center py-4 z-20 flex items-center justify-center"
                style={{ borderRadius: 0, background: "#192119", textShadow: "0 1px 2px rgba(0,0,0,0.3)", maxWidth: "100vw" }}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: pastVideoSection ? 100 : 0, opacity: pastVideoSection ? 0 : 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <svg ref={phoneIconRef} className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-1C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="font-semibold text-lg sm:text-xl" style={{ backgroundColor: "#192119" }}>
                    Call us at 502-207-3007
                </span>
            </motion.a>

            {/* Gradient overlay at bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, transparent 0%, #1a1f1a 100%)" }} />
        </main>
    );
}
