"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, type Variants, type Transition } from "framer-motion";
import Image from "next/image";
import { createPortal } from "react-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { ReviewItem, getBlurProps, renderStars, PANEL_WIDTH } from "./common";

type LightboxAction =
    | { type: "CLOSE_LIGHTBOX" }
    | { type: "NEXT_ITEM"; payload: { count: number } }
    | { type: "PREV_ITEM"; payload: { count: number } };

export function Lightbox({
                             open,
                             currentIndex,
                             items,
                             dispatch,
                             isMobile,
                         }: {
    open: boolean;
    currentIndex: number;
    items: ReviewItem[];
    isMobile: boolean;
    dispatch: (a: LightboxAction) => void;
}) {
    const mounted = typeof document !== "undefined";
    const currentItem = items[currentIndex] ?? items[0];
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    const overlayVariants: Variants = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
    const panelTransition: Transition = { type: "spring", stiffness: 320, damping: 34, when: "beforeChildren", staggerChildren: 0.05 };
    const panelExitTransition: Transition = { duration: 0.22, ease: "easeInOut", when: "afterChildren" };
    const mediaInTransition: Transition = { type: "spring", stiffness: 380, damping: 28 };
    const mediaOutTransition: Transition = { duration: 0.18 };
    const blockInTransition: Transition = { duration: 0.25 };
    const blockOutTransition: Transition = { duration: 0.16 };
    const controlInTransition: Transition = { duration: 0.18 };
    const controlOutTransition: Transition = { duration: 0.16 };

    const panelVariants: Variants = {
        initial: { y: 40, opacity: 0, scale: 0.98 },
        animate: { y: 0, opacity: 1, scale: 1, transition: panelTransition },
        exit: { y: 20, opacity: 0, scale: 0.985, transition: panelExitTransition },
    };
    const mediaVariants: Variants = {
        initial: { scale: 0.98, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: mediaInTransition },
        exit: { scale: 0.99, opacity: 0.3, transition: mediaOutTransition },
    };
    const blockVariants: Variants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: blockInTransition },
        exit: { opacity: 0, y: 8, transition: blockOutTransition },
    };
    const controlVariants: Variants = {
        initial: { opacity: 0, y: 0 },
        animate: { opacity: 1, y: 0, transition: controlInTransition },
        exit: { opacity: 0, y: -6, transition: controlOutTransition },
    };

    // prevent body scroll and keyboard nav
    useEffect(() => {
        if (!open) return;
        const html = document.documentElement;
        const body = document.body;
        const prevHtmlOverflow = html.style.overflow;
        const prevBodyOverflow = body.style.overflow;
        const prevHtmlPosition = html.style.position;
        const prevBodyPosition = body.style.position;
        const prevBodyTouchAction = body.style.touchAction;

        // Store scroll position
        const scrollY = window.scrollY;

        // Prevent scrolling on iOS and other mobile browsers
        html.style.overflow = "hidden";
        html.style.position = "fixed";
        body.style.overflow = "hidden";
        body.style.position = "fixed";
        body.style.touchAction = "none";
        body.style.top = `-${scrollY}px`;
        body.style.width = "100%";

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") dispatch({ type: "CLOSE_LIGHTBOX" });
            if (e.key === "ArrowRight") dispatch({ type: "NEXT_ITEM", payload: { count: items.length } });
            if (e.key === "ArrowLeft") dispatch({ type: "PREV_ITEM", payload: { count: items.length } });
        };
        window.addEventListener("keydown", onKey);
        closeBtnRef.current?.focus();
        return () => {
            // Restore styles
            html.style.overflow = prevHtmlOverflow;
            html.style.position = prevHtmlPosition;
            body.style.overflow = prevBodyOverflow;
            body.style.position = prevBodyPosition;
            body.style.touchAction = prevBodyTouchAction;
            body.style.top = "";
            body.style.width = "";

            // Restore scroll position
            window.scrollTo(0, scrollY);

            window.removeEventListener("keydown", onKey);
        };
    }, [open, items.length, dispatch]);

    const preloadNeighbors = useMemo(() => {
        if (!open) return [] as string[];
        const prev = (currentIndex - 1 + items.length) % items.length;
        const next = (currentIndex + 1) % items.length;
        return [items[prev]?.imageSrc, items[next]?.imageSrc].filter(Boolean) as string[];
    }, [open, currentIndex, items]);
    const uniquePreloads = useMemo(() => Array.from(new Set(preloadNeighbors)), [preloadNeighbors]);

    // Mobile expand/collapse for long text
    const textInnerRef = useRef<HTMLQuoteElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [clampLines, setClampLines] = useState<number>(6);

    useEffect(() => setIsExpanded(false), [currentIndex]);

    React.useLayoutEffect(() => {
        if (!isMobile) return;
        const measure = () => {
            const el = textInnerRef.current;
            if (!el) return;
            const viewportHeight = window.innerHeight;
            const safeAreaTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sat") || "0");
            const safeAreaBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sab") || "0");
            const titleHeight = 80;
            const imageMaxHeight = viewportHeight * 0.42;
            const padding = 40;
            const headerHeight = 50;
            const availableForText =
                viewportHeight - safeAreaTop - safeAreaBottom - titleHeight - imageMaxHeight - padding - headerHeight - 60;
            const cs = window.getComputedStyle(el);
            const lineHeightPx = parseFloat(cs.lineHeight) || (parseFloat(cs.fontSize) || 14) * 1.5 || 22;
            const linesThatFit = Math.max(2, Math.floor(availableForText / lineHeightPx));
            setClampLines(linesThatFit);
            setIsOverflowing(el.scrollHeight > availableForText);
        };
        measure();
        const ro = new ResizeObserver(measure);
        if (textInnerRef.current) ro.observe(textInnerRef.current);
        window.addEventListener("resize", measure);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, [isMobile, currentIndex]);

    if (!mounted) return null;

    return createPortal(
        <LayoutGroup id="mobileReview">
            {uniquePreloads.map((src, i) => (
                <link key={`${src}-${i}`} rel="preload" as="image" href={src} />
            ))}

            <AnimatePresence initial={false} mode="wait">
                {open && (
                    <motion.div
                        className="fixed inset-0 z-[2147483644] bg-[#161c16]/95 backdrop-blur-sm overscroll-contain"
                        variants={overlayVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        onClick={() => dispatch({ type: "CLOSE_LIGHTBOX" })}
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${currentItem.reviewerName}'s review — selected review`}
                    >
                        {/* Close */}
                        <motion.button
                            ref={closeBtnRef}
                            aria-label="Close review"
                            variants={controlVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="fixed z-[2147483647] text-white/90 hover:text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#40d6d1] bg-black/40 hover:bg-black/60 w-10 h-10 flex items-center justify-center"
                            style={{ borderRadius: "6px", top: `calc(env(safe-area-inset-top, 0px) + 20px)`, right: `calc(env(safe-area-inset-right, 0px) + 20px)` }}
                            onClick={(e) => {
                                e.stopPropagation();
                                dispatch({ type: "CLOSE_LIGHTBOX" });
                            }}
                        >
                            ✕
                        </motion.button>

                        {/* Panel */}
                        <div
                            className="absolute inset-0 p-4 sm:p-6 pb-16 overflow-hidden"
                            style={{
                                ["--lb-top"]: "calc(env(safe-area-inset-top, 0px) + 40px)",
                                ["--lb-bot"]: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
                                paddingTop: "var(--lb-top)",
                                paddingBottom: "var(--lb-bot)",
                            } as React.CSSProperties}
                        >
                            <motion.div
                                className="relative max-w-7xl w-full mx-auto"
                                variants={panelVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                onClick={(e) => e.stopPropagation()}
                                style={{ height: "calc(100svh - var(--lb-top) - var(--lb-bot))" }}
                            >
                                {/* Desktop layout */}
                                {!isMobile && (
                                    <div className="w-full h-full px-0 md:px-4 lg:px-4 py-2 md:py-0 lg:py-6 flex items-center justify-center">
                                        <motion.div variants={mediaVariants} className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
                                            {/* Media */}
                                            <div className="col-span-12 md:col-span-7 lg:col-span-8">
                                                <div className="relative overflow-hidden">
                                                    <Image
                                                        src={currentItem.imageSrc}
                                                        alt={currentItem.title}
                                                        width={1600}
                                                        height={1000}
                                                        className="w-full h-full max-h-[68vh] xl:max-h-[72vh] object-cover"
                                                        quality={95}
                                                        priority
                                                        {...getBlurProps(currentItem.blurDataURL)}
                                                        style={{ borderRadius: "6px" }}
                                                    />
                                                    <motion.button
                                                        aria-label="Previous review"
                                                        variants={controlVariants}
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 backdrop-blur-sm p-3 text-white text-xl focus:outline-none focus:ring-2 focus:ring-[#40d6d1] rounded-full transition-all hover:scale-110"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            dispatch({ type: "PREV_ITEM", payload: { count: items.length } });
                                                        }}
                                                    >
                                                        <FaAngleLeft />
                                                    </motion.button>
                                                    <motion.button
                                                        aria-label="Next review"
                                                        variants={controlVariants}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 backdrop-blur-sm p-3 text-white text-xl focus:outline-none focus:ring-2 focus:ring-[#40d6d1] rounded-full transition-all hover:scale-110"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            dispatch({ type: "NEXT_ITEM", payload: { count: items.length } });
                                                        }}
                                                    >
                                                        <FaAngleRight />
                                                    </motion.button>
                                                </div>

                                                {/* Dots */}
                                                {items.length > 1 && (
                                                    <div className="flex justify-center items-center gap-2.5 pt-4">
                                                        {items.map((_, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => dispatch({ type: "PREV_ITEM", payload: { count: 0 } })} // noop; dots were decorative before
                                                                aria-label={`Review ${index + 1}`}
                                                                className={`h-2.5 rounded-full transition-all duration-300 ease-in-out ${
                                                                    currentIndex === index ? "w-4 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Text */}
                                            <div className="col-span-12 md:col-span-5 lg:col-span-4">
                                                <motion.div
                                                    variants={blockVariants}
                                                    className="flex flex-col space-y-4 lg:space-y-5 rounded-lg bg-white/5 ring-1 ring-white/10 px-5 pt-5 pb-8 lg:px-6 lg:pt-6 lg:pb-10 h-[68vh] xl:h-[72vh] overflow-auto scrollbar-hide [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_calc(100%-4rem),transparent_100%)] [mask-image:linear-gradient(to_bottom,black_0%,black_calc(100%-4rem),transparent_100%)]"
                                                >
                                                    <div>
                                                        <h3 className="font-bold text-white leading-tight break-words text-[clamp(1.25rem,2.2vw,2rem)] md:text-[clamp(1.35rem,2vw,2.25rem)] lg:text-[clamp(1.4rem,1.6vw,2.2rem)]">
                                                            {currentItem.title}
                                                        </h3>
                                                        <p className="text-white/60 text-xs mt-1">
                                                            {currentItem.reviewDate && `Reviewed ${currentItem.reviewDate}`}
                                                        </p>
                                                        {currentItem.serviceName && (
                                                            <p className="text-[#40d6d1] text-xs font-medium mt-0.5">{currentItem.serviceName}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <h4 className="text-base font-semibold text-white">{currentItem.reviewerName}</h4>
                                                        <div className="mt-1 flex items-center gap-1">{renderStars(currentItem.rating, "h-5 w-5")}</div>
                                                    </div>

                                                    {currentItem.description && (
                                                        <blockquote className="text-[0.98rem] text-white/90 italic border-l-4 pl-4 leading-[1.5] whitespace-pre-wrap">
                                                            {currentItem.description}
                                                        </blockquote>
                                                    )}
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    </div>
                                )}

                                {/* Mobile layout */}
                                {isMobile && (
                                    <motion.div
                                        className="flex h-[100svh] flex-col gap-3 overflow-hidden"
                                        variants={blockVariants}
                                        style={{
                                            paddingTop: "calc(env(safe-area-inset-top, 0px) + 40px)",
                                            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
                                        }}
                                    >
                                        {/* Image */}
                                        <motion.div className="relative mx-6 mb-3 mt-0 overflow-hidden shrink-0" variants={mediaVariants} style={{ borderRadius: "6px" }}>
                                            <Image
                                                src={currentItem.imageSrc}
                                                alt={currentItem.title}
                                                width={1200}
                                                height={800}
                                                className="w-full max-h-[42svh] object-cover"
                                                style={{ borderRadius: "6px" }}
                                                quality={95}
                                                priority
                                                {...getBlurProps(currentItem.blurDataURL)}
                                            />
                                            <motion.button
                                                aria-label="Previous review"
                                                variants={controlVariants}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-2.5 text-white text-lg focus:outline-none focus:ring-2 focus:ring-[#40d6d1] rounded-full transition-all active:scale-95"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dispatch({ type: "PREV_ITEM", payload: { count: items.length } });
                                                }}
                                            >
                                                <FaAngleLeft />
                                            </motion.button>
                                            <motion.button
                                                aria-label="Next review"
                                                variants={controlVariants}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-2.5 text-white text-lg focus:outline-none focus:ring-2 focus:ring-[#40d6d1] rounded-full transition-all active:scale-95"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dispatch({ type: "NEXT_ITEM", payload: { count: items.length } });
                                                }}
                                            >
                                                <FaAngleRight />
                                            </motion.button>
                                        </motion.div>

                                        {/* Collapsed panel */}
                                        <div className="flex-1 px-6 pb-5 flex flex-col">
                                            {/* static rounded shell */}
                                            <div className={`relative flex-1 min-h-0 ${PANEL_WIDTH} rounded-t-[6px] overflow-hidden ring-1 ring-white/10 bg-[#2B2D31]`}>
                                                {/* shared-layout element: block, fills shell */}
                                                <motion.div
                                                    layoutId="mobileReviewPanel"
                                                    transition={{ type: "spring", stiffness: 420, damping: 40 }}
                                                    className="h-full w-full flex flex-col"
                                                    style={{ borderRadius: 0 }}
                                                >
                                                    <div className="h-full overflow-hidden px-5 py-4 lg:px-6 lg:py-5 flex flex-col space-y-4">
                                                        <div className="shrink-0">
                                                            <h3 className="font-bold text-white leading-tight break-words text-xl">{currentItem.title}</h3>
                                                            <p className="text-white/60 text-xs mt-1">{currentItem.reviewDate && `Reviewed ${currentItem.reviewDate}`}</p>
                                                            {currentItem.serviceName && <p className="text-[#40d6d1] text-xs font-medium mt-0.5">{currentItem.serviceName}</p>}
                                                        </div>

                                                        <div className="flex items-center justify-between shrink-0">
                                                            <h4 className="text-base font-semibold text-white">{currentItem.reviewerName}</h4>
                                                            {renderStars(currentItem.rating, "h-5 w-5")}
                                                        </div>

                                                        <div
                                                            className={`flex-1 min-h-0 overflow-auto ${
                                                                !isExpanded
                                                                    ? "[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_calc(100%-4rem),transparent_100%)] [mask-image:linear-gradient(to_bottom,black_0%,black_calc(100%-4rem),transparent_100%)]"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <blockquote
                                                                ref={textInnerRef}
                                                                className="text-[0.98rem] text-white/90 italic border-l-4 pl-4 leading-[1.5] whitespace-pre-wrap [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden"
                                                                style={isExpanded ? ({}) : ({ WebkitLineClamp: String(clampLines) } as React.CSSProperties)}
                                                            >
                                                                {currentItem.description}
                                                            </blockquote>
                                                        </div>
                                                    </div>

                                                    {!isExpanded && isOverflowing && (
                                                        <button
                                                            className="absolute right-4 bottom-3 text-sm font-medium text-[#40d6d1] hover:underline active:opacity-90"
                                                            onClick={() => setIsExpanded(true)}
                                                        >
                                                            Read more
                                                        </button>
                                                    )}
                                                </motion.div>
                                            </div>
                                        </div>



                                        <AnimatePresence>
                                            {isExpanded && (
                                                <>
                                                    {/* Scrim */}
                                                    <motion.div
                                                        key="expand-scrim"
                                                        className="fixed inset-0 z-[2147483645] bg-black/10"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    />

                                                    {/* Expanded host */}
                                                    <motion.div
                                                        key="expand-host"
                                                        className="fixed inset-x-0 z-[2147483646] pointer-events-none"
                                                        style={{
                                                            top: "0",
                                                            bottom: "calc(env(safe-area-inset-bottom, 0px))",
                                                        }}
                                                        initial={false}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 1 }}
                                                    >
                                                        <div
                                                            className="h-full w-full px-8"
                                                            style={{
                                                                paddingTop: "calc(env(safe-area-inset-top, 0px) + 72px)",
                                                            }}
                                                        >
                                                            <motion.div
                                                                layoutId="mobileReviewPanel"
                                                                transition={{ type: "spring", stiffness: 420, damping: 40 }}
                                                                className={`relative pointer-events-auto h-full ${PANEL_WIDTH} bg-[#2B2D31]/100 ring-1 ring-white/10 shadow-xl overflow-hidden flex flex-col`}
                                                                style={{ borderRadius: "6px 6px 0 0" }}
                                                            >
                                                                <div className="flex-1 overflow-y-auto px-5 py-5 lg:px-6 lg:py-6 scrollbar-hide [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_calc(100%-4rem),transparent_100%)] [mask-image:linear-gradient(to_bottom,black_0%,black_calc(100%-4rem),transparent_100%)]">
                                                                    <div className="flex flex-col space-y-4 lg:space-y-5">
                                                                        <div>
                                                                            <h3 className="font-bold text-white leading-tight break-words text-xl">
                                                                                {currentItem.title}
                                                                            </h3>
                                                                            <p className="text-white/60 text-xs mt-1">
                                                                                {currentItem.reviewDate && `Reviewed ${currentItem.reviewDate}`}
                                                                            </p>
                                                                            {currentItem.serviceName && (
                                                                                <p className="text-[#40d6d1] text-xs font-medium mt-0.5">
                                                                                    {currentItem.serviceName}
                                                                                </p>
                                                                            )}
                                                                        </div>

                                                                        <div className="flex items-center justify-between">
                                                                            <h4 className="text-base font-semibold text-white">
                                                                                {currentItem.reviewerName}
                                                                            </h4>
                                                                            {renderStars(currentItem.rating, "h-5 w-5")}
                                                                        </div>

                                                                        {currentItem.description && (
                                                                            <blockquote className="text-[0.98rem] text-white/90 italic border-l-4 pl-4 leading-[1.5] whitespace-pre-wrap">
                                                                                {currentItem.description}
                                                                            </blockquote>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Footer — Collapse button */}
                                                                <div
                                                                    className="absolute inset-x-0 bottom-0 px-6 py-4 flex justify-end"
                                                                    style={{
                                                                        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
                                                                    }}
                                                                >
                                                                    <button
                                                                        className="text-sm font-medium text-[#40d6d1] hover:underline active:opacity-90"
                                                                        onClick={() => setIsExpanded(false)}
                                                                    >
                                                                        Collapse
                                                                    </button>
                                                                </div>
                                                            </motion.div>
                                                        </div>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </LayoutGroup>,
        document.body
    );
}
