"use client";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { animate, useMotionValue, type AnimationPlaybackControls } from "framer-motion";
import { Lightbox } from "./Lightbox";
import { CarouselTrack } from "./CarouselTrack";
import { ReviewCarouselProps, ReviewItem } from "./common";

const initialState = {
    selectedIndex: null as number | null,
    isUserPaused: false,
    isDragging: false,
    touchedItem: null as number | null,
};
type Action =
    | { type: "OPEN_LIGHTBOX"; payload: { index: number } }
    | { type: "CLOSE_LIGHTBOX" }
    | { type: "NEXT_ITEM"; payload: { count: number } }
    | { type: "PREV_ITEM"; payload: { count: number } }
    | { type: "GO_TO_ITEM"; payload: { index: number } }
    | { type: "TOGGLE_PAUSE" }
    | { type: "START_DRAG" }
    | { type: "END_DRAG" }
    | { type: "SET_TOUCHED"; payload: { index: number } };

function carouselReducer(state: typeof initialState, action: Action) {
    switch (action.type) {
        case "OPEN_LIGHTBOX":
            return { ...state, selectedIndex: action.payload.index };
        case "CLOSE_LIGHTBOX":
            return { ...state, selectedIndex: null };
        case "NEXT_ITEM":
            if (state.selectedIndex === null) return state;
            return { ...state, selectedIndex: (state.selectedIndex + 1) % action.payload.count };
        case "PREV_ITEM":
            if (state.selectedIndex === null) return state;
            return { ...state, selectedIndex: (state.selectedIndex - 1 + action.payload.count) % action.payload.count };
        case "GO_TO_ITEM":
            return { ...state, selectedIndex: action.payload.index };
        case "TOGGLE_PAUSE":
            return { ...state, isUserPaused: !state.isUserPaused };
        case "START_DRAG":
            return { ...state, isDragging: true };
        case "END_DRAG":
            return { ...state, isDragging: false };
        case "SET_TOUCHED":
            return { ...state, touchedItem: state.touchedItem === action.payload.index ? null : action.payload.index };
        default:
            return state;
    }
}

export default function ReviewCarousel({
                                           items,
                                           autoScrollSpeed = 24,
                                           enableQueryParam = true,
                                       }: ReviewCarouselProps) {
    const [state, dispatch] = useReducer(carouselReducer, initialState);
    const { selectedIndex, isUserPaused, isDragging, touchedItem } = state;

    const containerRef1 = useRef<HTMLDivElement>(null);
    const x1 = useMotionValue(0);
    const isPaused1Ref = useRef(false);
    const startTime1Ref = useRef<number | null>(null);
    const pausedAt1Ref = useRef(0);
    const [duplicateCount, setDuplicateCount] = useState(4);
    const [isMobile, setIsMobile] = useState(false);

    const dragX = useMotionValue(0);
    const mobileAnimRef = useRef<AnimationPlaybackControls | null>(null);
    const [mobileCarouselIndex, setMobileCarouselIndex] = useState(0);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        const update = () => {
            if (typeof window !== "undefined") setDuplicateCount(Math.max(4, Math.ceil(window.innerWidth / 250) + 2));
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const displayItems = useMemo<ReviewItem[]>(
        () =>
            items.length
                ? items
                : [
                    {
                        imageSrc: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&q=80",
                        blurDataURL:
                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/8oSNAAAAI0lEQVR42mN8//HLfwYgYGViZGZkgAlQZ2RiiDBYgGIpAGc+D31fnyixAAAAAElFTkSuQmCC",
                        title: "Exceptional Roof Replacement Service",
                        description: "The team did an amazing job replacing our roof... Highly recommend!",
                        reviewerName: "Sarah Johnson",
                        rating: 5,
                        reviewDate: "2 weeks ago",
                        serviceName: "Roof Replacement",
                    },
                    {
                        imageSrc: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
                        blurDataURL:
                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/8oSNAAAAIklEQVR42mN8/2fhPwYgYGFgYPBgAlQZ2SAi2AADwYgFAM7gD31is7zPAAAAAElFTkSuQmCC",
                        title: "Quick Storm Damage Response",
                        description: "After the recent hailstorm, they responded within hours...",
                        reviewerName: "Mike Chen",
                        rating: 5,
                        reviewDate: "1 month ago",
                        serviceName: "Storm Damage Repair",
                    },
                ],
        [items]
    );

    const finalExtendedItems = useMemo(() => {
        const extended: ReviewItem[] = [];
        for (let i = 0; i < duplicateCount; i++) extended.push(...displayItems);
        return extended;
    }, [displayItems, duplicateCount]);

    // desktop auto-scroll
    useEffect(() => {
        if (!containerRef1.current || displayItems.length === 0) return;
        if (isMobile) return;
        const totalWidth = 520 * displayItems.length;
        let raf = 0;
        const animateRaf = (ts: number) => {
            if (!startTime1Ref.current) startTime1Ref.current = ts;
            const shouldRun = !isPaused1Ref.current && !isUserPaused && !isDragging;
            if (shouldRun) {
                const elapsed = ts - startTime1Ref.current + pausedAt1Ref.current;
                const distance = (elapsed * autoScrollSpeed) / 1000;
                const raw = -distance;
                if (-raw >= totalWidth) {
                    const overflow = -raw - totalWidth;
                    startTime1Ref.current = ts;
                    pausedAt1Ref.current = (overflow * 1000) / autoScrollSpeed;
                    x1.set(-overflow);
                } else x1.set(raw);
            } else {
                pausedAt1Ref.current = ts - (startTime1Ref.current ?? ts) + pausedAt1Ref.current;
                startTime1Ref.current = null;
            }
            raf = requestAnimationFrame(animateRaf);
        };
        raf = requestAnimationFrame(animateRaf);
        return () => raf && cancelAnimationFrame(raf);
    }, [displayItems.length, autoScrollSpeed, x1, isDragging, isUserPaused, isMobile]);

    const getMobileTargetX = (index: number) => {
        const itemWidth = 280 + 12;
        const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        const centerOffset = (viewportWidth - 280) / 2;
        return -(index * itemWidth) + centerOffset;
    };
    const goToMobileIndex = (index: number, opts?: { immediate?: boolean }) => {
        const clamped = Math.max(0, Math.min(finalExtendedItems.length - 1, index));
        setMobileCarouselIndex(clamped);
        const targetX = getMobileTargetX(clamped);
        mobileAnimRef.current?.stop();
        if (opts?.immediate) {
            dragX.set(targetX);
            return;
        }
        mobileAnimRef.current = animate(dragX, targetX, { type: "spring", stiffness: 750, damping: 150, mass: 2 });
    };

    useEffect(() => {
        if (!isMobile || displayItems.length === 0) return;
        if (isDragging || isUserPaused) return;
        const interval = setInterval(() => {
            const nextIndex = (mobileCarouselIndex + 1) % finalExtendedItems.length;
            goToMobileIndex(nextIndex);
        }, 3000);
        return () => clearInterval(interval);
    }, [isMobile, displayItems.length, isDragging, isUserPaused, finalExtendedItems.length, mobileCarouselIndex]);

    useEffect(() => {
        if (!isMobile) return;
        goToMobileIndex(mobileCarouselIndex, { immediate: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile]);

    const handleDrag = (_e: any, info: any) => {
        if (!isMobile) return;
        const v = info.velocity.x;
        if (Math.abs(v) > 500) {
            const dir = v > 0 ? -1 : 1;
            goToMobileIndex(mobileCarouselIndex + dir);
        }
    };
    const handleDragEnd = () => {
        if (!isMobile) return;
        dispatch({ type: "END_DRAG" });
        const currentX = dragX.get();
        const itemWidth = 280 + 12;
        const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        const centerOffset = (viewportWidth - 280) / 2;
        const nearestIndex = Math.round(-(currentX - centerOffset) / itemWidth);
        goToMobileIndex(nearestIndex);
    };
    const handleHoverStart = () => { if (!isMobile) isPaused1Ref.current = true; };
    const handleHoverEnd = () => { if (!isMobile) isPaused1Ref.current = false; };

    const minDrag = React.useMemo(() => {
        const itemWidth = isMobile ? 280 : 520;
        const gap = isMobile ? 12 : 20;
        const totalWidth = (itemWidth + gap) * finalExtendedItems.length;
        const containerWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        return -(totalWidth - containerWidth + 100);
    }, [finalExtendedItems.length, isMobile]);

    // deep link ?review=
    useEffect(() => {
        if (!enableQueryParam) return;
        const url = new URL(window.location.href);
        const p = url.searchParams.get("review");
        if (p !== null) {
            const n = Number(p);
            if (!Number.isNaN(n) && n >= 0 && n < displayItems.length) dispatch({ type: "OPEN_LIGHTBOX", payload: { index: n } });
        }
    }, [enableQueryParam, displayItems.length]);

    useEffect(() => {
        if (!enableQueryParam) return;
        const url = new URL(window.location.href);
        const open = selectedIndex !== null;
        if (open) {
            url.searchParams.set("review", String(selectedIndex ?? 0));
            window.history.replaceState(null, "", url.toString());
        } else {
            url.searchParams.delete("review");
            window.history.replaceState(null, "", url.toString());
        }
    }, [selectedIndex, enableQueryParam]);

    const open = selectedIndex !== null;
    const current = selectedIndex ?? 0;

    return (
        <>
            <section className="relative w-full px-4 sm:px-8 pb-8">
                <CarouselTrack
                    containerRef={containerRef1}
                    displayItems={displayItems}
                    finalExtendedItems={finalExtendedItems}
                    isMobile={isMobile}
                    mobileCarouselIndex={mobileCarouselIndex}
                    touchedItem={touchedItem}
                    onTouchStartItem={(idx) => isMobile && !isDragging && dispatch({ type: "SET_TOUCHED", payload: { index: idx } })}
                    onOpenLightbox={(baseIndex) => dispatch({ type: "OPEN_LIGHTBOX", payload: { index: baseIndex } })}
                    dragX={dragX}
                    x1={x1}
                    handleDragStart={() => dispatch({ type: "START_DRAG" })}
                    handleDrag={handleDrag}
                    handleDragEnd={handleDragEnd}
                    handleHoverStart={handleHoverStart}
                    handleHoverEnd={handleHoverEnd}
                    minDrag={minDrag}
                />
            </section>

            <Lightbox
                open={open}
                currentIndex={current}
                items={displayItems}
                dispatch={dispatch as any}
                isMobile={isMobile}
            />
        </>
    );
}
