"use client";
import React from "react";
import { motion, PanInfo, MotionValue } from "framer-motion";
import Image from "next/image";
import { ReviewItem, getBlurProps, renderStars } from "./common";

export function CarouselTrack({
    containerRef,
    displayItems,
    finalExtendedItems,
    isMobile,
    mobileCarouselIndex,
    touchedItem,
    onTouchStartItem,
    onOpenLightbox,
    dragX,
    x1,
    handleDrag,
    handleDragStart,
    handleDragEnd,
    handleHoverStart,
    handleHoverEnd,
    minDrag,
}: {
    containerRef: React.Ref<HTMLDivElement>;
    displayItems: ReviewItem[];
    finalExtendedItems: ReviewItem[];
    isMobile: boolean;
    mobileCarouselIndex: number;
    touchedItem: number | null;
    onTouchStartItem: (idx: number) => void;
    onOpenLightbox: (baseIndex: number) => void;
    dragX: MotionValue<number>;
    x1: MotionValue<number>;
    handleDrag: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
    handleDragStart: () => void;
    handleDragEnd: () => void;
    handleHoverStart: () => void;
    handleHoverEnd: () => void;
    minDrag: number;
}) {
    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#192119] to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#192119] to-transparent z-20 pointer-events-none" />

            <div className="relative z-10 w-full space-y-2 pt-0">
                <div
                    className="relative overflow-visible"
                    onMouseEnter={handleHoverStart}
                    onMouseLeave={handleHoverEnd}
                >
                    <motion.div
                        ref={containerRef}
                        className={`flex gap-3 sm:gap-5 pt-2 pb-2 ${isMobile ? "draggable" : ""}`}
                        style={{ x: isMobile ? dragX : x1 }}
                        drag={isMobile ? "x" : false}
                        dragConstraints={isMobile ? { left: minDrag, right: 0 } : undefined}
                        dragElastic={0.2}
                        dragMomentum={false}
                        onDragStart={handleDragStart}
                        onDrag={handleDrag}
                        onDragEnd={handleDragEnd}
                        whileDrag={{ cursor: "grabbing" }}
                    >
                        {finalExtendedItems.map((item, idx) => {
                            const baseIndex = idx % displayItems.length;
                            const distanceFromCenter = Math.abs(idx - mobileCarouselIndex) % finalExtendedItems.length;
                            const scale = isMobile && distanceFromCenter === 0 ? 1.03 : 1;

                            return (
                                <motion.div
                                    key={`${item.imageSrc || item.reviewerName}-${idx}`}
                                    className="relative flex-shrink-0 w-[280px] sm:w-[400px] md:w-[500px] h-[180px] sm:h-[240px] md:h-[300px] rounded-lg overflow-hidden group cursor-pointer"
                                    whileHover={!isMobile ? { scale: 1.05, zIndex: 10 } : {}}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    style={{ originX: 0.5, originY: 0.5, touchAction: isMobile ? "pan-y" : "auto", scale }}
                                    onTouchStart={() => onTouchStartItem(idx)}
                                    onClick={() => onOpenLightbox(baseIndex)}
                                    animate={{ zIndex: isMobile && touchedItem === idx ? 10 : 1 }}
                                >
                                    {item.imageSrc ? (
                                        <>
                                            <div className="absolute inset-0">
                                                <Image
                                                    src={item.imageSrc!}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    sizes="(max-width: 768px) 280px, (max-width: 1024px) 400px, 500px"
                                                    priority={idx < 3}
                                                    quality={85}
                                                    style={{ borderRadius: "6px" }}
                                                    {...getBlurProps(item.blurDataURL)}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                            </div>

                                            <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 z-[5] pointer-events-none blur-feather" />

                                            <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4">
                                                <div className="flex items-center gap-2 mb-2">{renderStars(item.rating, "h-4 w-4")}</div>
                                                <p className="text-xs sm:text-sm text-[#40d6d1] font-medium mb-1">{item.reviewerName}</p>
                                                <h3 className="text-xs sm:text-sm font-semibold text-white mb-1 line-clamp-1">{item.title}</h3>
                                                <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                                                    "
                                                    {item.description.length > 80 ? `${item.description.substring(0, 80)}...` : item.description}
                                                    "
                                                </p>
                                                {item.serviceName && (
                                                    <div className="mt-2">
                                                        <span className="inline-flex items-center px-2 py-1 bg-[#40d6d1]/20 text-[#40d6d1] text-xs font-medium rounded-md">
                                                            {item.serviceName}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a231a] to-[#0f150f] p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
                                            <span className="absolute -top-4 -right-2 text-[120px] text-white/5 leading-none select-none pointer-events-none font-serif">"</span>

                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="flex items-center gap-2 mb-3 sm:mb-4">{renderStars(item.rating, "h-4 w-4")}</div>
                                                <h3 className="text-sm sm:text-base font-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
                                                <p className="text-xs sm:text-sm text-white/80 italic leading-relaxed line-clamp-3 sm:line-clamp-4 flex-grow">
                                                    "{item.description}"
                                                </p>
                                                <div className="mt-4 pt-3 border-t border-white/10 shrink-0">
                                                    <p className="text-xs sm:text-sm text-[#40d6d1] font-medium">{item.reviewerName}</p>
                                                    {item.serviceName && (
                                                        <div className="mt-1.5">
                                                            <span className="inline-flex items-center px-1.5 py-0.5 bg-[#40d6d1]/10 text-[#40d6d1] text-[10px] sm:text-xs font-medium rounded">
                                                                {item.serviceName}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className={`absolute inset-0 rounded-xl border border-[#40d6d1] transition-opacity duration-300 pointer-events-none ${isMobile && touchedItem === idx ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                            }`}
                                    />
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>

            <style jsx>{`
                @media (prefers-reduced-motion: no-preference) {
                    * {
                        will-change: transform;
                    }
                }
                @media (max-width: 768px) {
                    .draggable {
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                        -webkit-touch-callout: none;
                    }
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .blur-feather {
                    backdrop-filter: blur(1px);
                    -webkit-backdrop-filter: blur(1px);
                    mask-image: linear-gradient(to top, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 100%);
                    background: linear-gradient(to top, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0));
                }
            `}</style>
        </div>
    );
}
