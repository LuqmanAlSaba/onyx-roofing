"use client";

import { useEffect, useRef } from "react";

/**
 * Custom hook to lock body scroll with improved iOS support
 * Prevents background scrolling when form is open
 * Returns a function to manually restore scroll position
 */
export function useFormScrollLock(isLocked: boolean) {
    const scrollPositionRef = useRef<number>(0);
    const scrollbarWidthRef = useRef<number>(0);

    useEffect(() => {
        if (!isLocked) return;

        // Save current scroll position
        scrollPositionRef.current = window.scrollY;
        scrollbarWidthRef.current = window.innerWidth - document.documentElement.clientWidth;

        // Apply scroll lock styles
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollPositionRef.current}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";

        // Compensate for scrollbar width to prevent layout shift
        if (scrollbarWidthRef.current > 0) {
            document.body.style.paddingRight = `${scrollbarWidthRef.current}px`;
        }

        // Prevent scroll chaining on iOS (bounce scroll affecting background)
        document.documentElement.style.overscrollBehavior = "none";
        document.body.style.overflow = "hidden";

        // Cleanup - only remove styles when component unmounts completely
        return () => {
            // Remove all scroll lock styles
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";
            document.body.style.paddingRight = "";
            document.body.style.overflow = "";
            document.documentElement.style.overscrollBehavior = "";

            // Restore scroll position immediately
            window.scrollTo(0, scrollPositionRef.current);
        };
    }, [isLocked]);
}
