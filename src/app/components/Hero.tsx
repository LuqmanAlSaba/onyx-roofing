"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useEdgeSelectedVideo } from "@/hooks/useEdgeSelectedVideo";

import Hamburger from "./Hamburger";

interface HeroProps {
    isFormOpen?: boolean;
    onOpenForm: () => void;
    initialVideo: string;
}

export default function Hero({ isFormOpen = false, onOpenForm, initialVideo }: HeroProps) {
    // Local UI state
    const [scrolled, setScrolled] = useState(false);
    const [pastVideoSection, setPastVideoSection] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Refs
    const phoneIconRef = useRef<SVGSVGElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Use the Edge-selected video with server-provided initial value
    const currentVideo = useEdgeSelectedVideo(initialVideo);

    // --- Effects
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

    // Scroll effects for nav scaling + call banner visibility
    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const y = window.scrollY;
                    setScrolled(y > 20);
                    setPastVideoSection(y > 30);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Subtle parallax from mouse movement
    useEffect(() => {
        let targetX = 0,
            targetY = 0,
            currentX = 0,
            currentY = 0,
            raf = 0;
        const k = 0.08;
        const onMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            targetX = (clientX - cx) / cx;
            targetY = (clientY - cy) / cy;
        };
        const loop = () => {
            currentX += (targetX - currentX) * k;
            currentY += (targetY - currentY) * k;
            if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
                setMousePosition({ x: currentX, y: currentY });
            }
            raf = requestAnimationFrame(loop);
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        raf = requestAnimationFrame(loop);
        return () => {
            window.removeEventListener("mousemove", onMove);
            cancelAnimationFrame(raf);
        };
    }, []);

    // Smooth scroll helper
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const idMap: Record<string, string> = { services: "services", projects: "portfolio", about: "about", contact: "contact", coverage: "coverage" };
        const actualId = idMap[targetId] || targetId;
        const el = document.getElementById(actualId);
        if (!el) return;
        const target = el.getBoundingClientRect().top + window.pageYOffset;
        const start = window.pageYOffset;
        const dist = target - start;
        const duration = 800;
        let begin: number | null = null;
        const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1);
        const step = (now: number) => {
            if (begin === null) begin = now;
            const elapsed = now - begin;
            const p = Math.min(elapsed / duration, 1);
            const ease = easeInOutCubic(p);
            window.scrollTo(0, start + dist * ease);
            if (elapsed < duration) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        if (isMenuOpen) setIsMenuOpen(false);
    };

    // ===== position helper for videos (spread operator) =====
    const getVideoPositionStyles = (src: string | null) => {
        const isHalloween = src === "/videos/house-halloween.mp4";
        return isHalloween
            ? { bottom: 0 as const, top: '-100px' as const, objectPosition: 'center bottom' as const }
            : { top: '0' as const, bottom: 'auto' as const };
    };

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
                <canvas id="confetti-canvas" className="absolute inset-0 pointer-events-none h-full" style={{ zIndex: 100 }} />

                {/* Blurred, animated video background */}
                <motion.div
                    className="absolute inset-0 h-full overflow-hidden"
                    style={{ backgroundColor: "#192119" }}
                    animate={{ scale: scrolled ? 1.02 : 1 }}
                    transition={{ duration: 0.52, ease: "easeOut" }}
                >
                    {/* Single video: src is controlled by useEdgeSelectedVideo via #heroVideo */}
                    <motion.video
                        id="heroVideo"
                        ref={videoRef}
                        className="house-background absolute w-full h-full will-change-transform object-cover"
                        style={{
                            filter: "blur(5px) brightness(1) saturate(0.75)",
                            transform: isMobile
                                ? "scale(1.05)"
                                : `scale(1.08) translate3d(${mousePosition.x * -50}px, calc(${mousePosition.y * -15}px - 10px), 0)`,
                            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.6) 100%)",
                            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.6) 100%)",
                            left: 0,
                            width: "100%",
                            height: "100%",
                            ...getVideoPositionStyles(currentVideo), // <-- conditional bottom/top + objectPosition
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.0, ease: "easeInOut" }}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        poster=""
                    />

                    {/* Soft glows */}
                    <div className="hidden md:block absolute top-1/3 left-1/4 w-96 h-96 bg-[#13938f]/3 rounded-full blur-[120px] animate-pulse-slow will-change-[opacity]" />
                    <div className="hidden md:block absolute bottom-1/3 right-1/3 w-96 h-96 bg-white/3 rounded-full blur-[100px] animate-pulse-slower will-change-[opacity]" />
                </motion.div>

                {/* NAV + HERO CONTENT */}
                <div className="relative z-100 pb-16 md:pb-0">
                    {/* Static Navigation (only visible in hero) */}
                    <motion.nav
                        className="absolute top-0 left-0 right-0 z-40 py-6 md:py-10"
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        <div className="max-w-7xl mx-auto px-12 pt-0 sm:px-8 flex items-center justify-between">
                            <motion.div className="h-10 sm:h-13 w-auto brightness-0 invert z-100 relative" whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
                                <Image src="/onyx-roofing-logo-black.png" alt="Onyx Roofing" width={120} height={40} className="h-10 sm:h-13 w-auto brightness-0 invert" priority />
                            </motion.div>

                            <div className="hidden md:flex items-center gap-8">
                                {["Services", "Projects", "About", "Coverage", "Contact"].map((item, index) => {
                                    const targetId = item.toLowerCase();
                                    return (
                                        <motion.a
                                            key={item}
                                            href={`#${targetId}`}
                                            onClick={(e) => handleNavClick(e, targetId)}
                                            className="text-white/80 hover:text-white text-md font-normal transition-all duration-300"
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                                        >
                                            {item}
                                        </motion.a>
                                    );
                                })}
                            </div>

                            <div className="md:hidden z-100">
                                <Hamburger
                                  isOpen={isMenuOpen}
                                  onToggle={() => setIsMenuOpen(o => !o)}
                                  size={40}
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    className="fixed inset-0 z-30 bg-[#2a2d31] overflow-hidden"
                                    style={{ paddingTop: "env(safe-area-inset-top)" }}
                                    initial={{ y: "100%", scale: 0.95, opacity: 0 }}
                                    animate={{ y: 0, scale: 1, opacity: 1 }}
                                    exit={{ y: "100%", scale: 0.95, opacity: 0 }}
                                    transition={{ y: { duration: 0.52, ease: [0.32, 0.72, 0, 1] }, scale: { duration: 0.5, ease: [0.32, 0.72, 0, 1] }, opacity: { duration: 0.4, ease: "easeOut" } }}
                                >
                                    <div className="h-full flex flex-col items-center justify-center space-y-6 px-6">
                                        {["Services", "Projects", "About", "Contact"].map((item, i) => {
                                            const targetId = item.toLowerCase();
                                            return (
                                                <motion.a
                                                    key={item}
                                                    href={`#${targetId}`}
                                                    onClick={(e) => handleNavClick(e, targetId)}
                                                    className="text-white text-2xl font-medium"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                                                >
                                                    {item}
                                                </motion.a>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.nav>

                    {/* HERO copy + CTAs */}
                    <section className="relative h-full flex items-center justify-center px-4 sm:px-8">
                        <AnimatePresence mode="wait">
                            {!isFormOpen ? (
                                <motion.div
                                    key="hero-content"
                                    className="relative z-20 text-left mx-auto px-4 max-w-md sm:max-w-lg md:max-w-4xl pt-40 w-full"
                                    initial={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                >
                                    <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}>
                                        <h1
                                            className="text-2xl sm:text-2xl md:text-4xl lg:text-6xl font-light leading-tight"
                                            style={{ textAlign: "left", textShadow: "-0px 0px 3px rgba(0,0,0,.32)" }}
                                        >
                      <span className="block text-white mb-1 sm:mb-3 tracking-wide" style={{ mixBlendMode: "difference" }}>
                        Built to{" "}
                          <span className="font-normal" style={{ mixBlendMode: "difference", color: "#40d6d1" }}>
                          Withstand.
                        </span>
                      </span>
                                            <span className="block text-white tracking-wide" style={{ mixBlendMode: "difference" }}>
                        Designed to{" "}
                                                <span className="font-normal" style={{ mixBlendMode: "difference", color: "#40d6d1" }}>
                          Impress.
                        </span>
                      </span>
                                        </h1>
                                    </motion.div>

                                    <motion.p
                                        className="mt-6 sm:mt-10 text-sm sm:text-base md:text-lg text-white/80 max-w-md sm:max-w-lg md:max-w-2xl leading-relaxed font-light"
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                                    >
                                        Your trusted roofing professionals serving Louisville and all of Kentucky.
                                        {!isMobile ? <span className="block mt-1">Premium craftsmanship for discerning homeowners.</span> : ""}
                                    </motion.p>

                                    <motion.div
                                        className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-start items-start"
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
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
                                            onClick={(e) => handleNavClick(e, "portfolio")}
                                            className="shimmer-effect px-6 sm:px-8 md:px-10 py-3 sm:py-4 border border-white/50 text-white hover:bg-white hover:text-gray-900 font-normal rounded-full transition-all duration-300 cursor-pointer text-sm sm:text-base transform-gpu"
                                            style={{ backdropFilter: "blur(20px)" }}
                                        >
                                            View Our Work
                                        </motion.a>
                                    </motion.div>

                                    <motion.div
                                        className="mt-8 sm:mt-16 grid grid-cols-2 sm:flex sm:flex-wrap justify-start items-stretch gap-2 sm:gap-3 text-xs sm:text-sm"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.7 }}
                                    >
                                        {["Licensed & Insured", "Free Inspection", "Kentucky Owned", "Family Business"]
                                            .filter((item) => !(isMobile && (item === "Kentucky Owned" || item === "Family Business")))
                                            .map((item, index) => (
                                                <motion.span
                                                    key={item}
                                                    className="inline-flex items-center gap-2 text-white/90 font-light px-2 sm:px-3 py-1 sm:py-2 bg-[#474747]/30 backdrop-blur-md h-full transform-gpu"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                                                    style={{ borderRadius: 16, border: "2px solid rgba(200,200,200,0.04)" }}
                                                >
                                                    <span className="text-sm">✓</span>
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
