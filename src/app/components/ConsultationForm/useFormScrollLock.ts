"use client";

import { useEffect } from "react";

/**
 * Custom hook to lock body scroll with improved iOS support
 * Prevents background scrolling when form is open
 */
export function useFormScrollLock(isLocked: boolean) {
    useEffect(() => {
        if (!isLocked) return;

        // Save current scroll position
        const scrollY = window.scrollY;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        // Apply scroll lock styles
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";

        // Compensate for scrollbar width to prevent layout shift
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        // Prevent scroll chaining on iOS (bounce scroll affecting background)
        document.documentElement.style.overscrollBehavior = "none";
        document.body.style.overflow = "hidden";

        // Cleanup function
        return () => {
            const top = document.body.style.top;
            const scrollPosition = top ? -parseInt(top, 10) : 0;

            // Remove all scroll lock styles
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";
            document.body.style.paddingRight = "";
            document.body.style.overflow = "";
            document.documentElement.style.overscrollBehavior = "";

            // Use requestAnimationFrame to restore scroll position after browser repaint
            // This prevents the visible jump where the page briefly shows the top before scrolling
            requestAnimationFrame(() => {
                window.scrollTo(0, scrollPosition);
            });
        };
    }, [isLocked]);
}
