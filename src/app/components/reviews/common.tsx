"use client";
import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export interface ReviewItem {
    title: string;
    description: string;
    imageSrc?: string;
    reviewerName: string;
    blurDataURL?: string;
    reviewerPhoto?: string;
    link?: string;
    rating?: number;
    reviewDate?: string;
    serviceName?: string;
}

export interface ReviewCarouselProps {
    items: ReviewItem[];
    autoScrollSpeed?: number;
    enableQueryParam?: boolean;
}

export const PANEL_WIDTH = "max-w-[720px] w-full mx-auto";

export const getBlurProps = (blur?: string) =>
    blur ? ({ placeholder: "blur" as const, blurDataURL: blur }) : ({});

export const renderStars = (rating?: number, sizeClass = "h-3.5 w-3.5") => {
    const r = Math.max(0, Math.min(5, rating ?? 5));
    const full = Math.floor(r);
    const half = r - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    const Star = () => <FaStar className={sizeClass} />;
    const Half = () => <FaStarHalfAlt className={sizeClass} />;
    const Empty = () => <FaRegStar className={sizeClass} />;
    return (
        <div className="flex items-center gap-1 text-[#ffd166] drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
            {Array.from({ length: full }).map((_, i) => <Star key={`f-${i}`} />)}
            {half === 1 && <Half key="half" />}
            {Array.from({ length: empty }).map((_, i) => <Empty key={`e-${i}`} />)}
        </div>
    );
};
