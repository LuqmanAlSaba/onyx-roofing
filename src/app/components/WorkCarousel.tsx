"use client"
import React, { useRef, useEffect, useMemo, useState } from 'react'
import { motion, useMotionValue, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export interface WorkItem {
  title: string
  description: string
  imageSrc: string
  link?: string
}

interface WorkCarouselProps {
  items: WorkItem[]
  autoScrollSpeed?: number // pixels per second
}

export default function WorkCarousel({
                                       items,
                                       autoScrollSpeed = 24,
                                     }: WorkCarouselProps) {
  const containerRef1 = useRef<HTMLDivElement>(null)
  const containerRef2 = useRef<HTMLDivElement>(null)
  const x1 = useMotionValue(0)
  const x2 = useMotionValue(0)

  // Use refs for pause state to avoid effect re-runs
  const isPaused1Ref = useRef(false)
  const isPaused2Ref = useRef(false)

  // Animation state refs that persist across renders
  const startTime1Ref = useRef<number | null>(null)
  const startTime2Ref = useRef<number | null>(null)
  const pausedAt1Ref = useRef(0)
  const pausedAt2Ref = useRef(0)

  // Calculate how many times to duplicate items for seamless loop
  const [duplicateCount, setDuplicateCount] = useState(4)

  // Touch interaction state
  const [touchedItem, setTouchedItem] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null) // ← Lightbox state

  const dragX = useMotionValue(0)
  const constraintsRef = useRef<HTMLDivElement>(null)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Update duplicate count on resize
  useEffect(() => {
    const updateDuplicateCount = () => {
      if (typeof window !== 'undefined') {
        setDuplicateCount(Math.max(4, Math.ceil(window.innerWidth / 250) + 2))
      }
    }
    updateDuplicateCount()
    window.addEventListener('resize', updateDuplicateCount)
    return () => window.removeEventListener('resize', updateDuplicateCount)
  }, [])

  const extendedItems = useMemo(() => {
    const extended = []
    for (let i = 0; i < duplicateCount; i++) {
      extended.push(...items)
    }
    return extended
  }, [items, duplicateCount])

// Row 1 Animation (Left to Right)
  useEffect(() => {
    if (!containerRef1.current || extendedItems.length === 0) return;

    const itemWidth = 520;
    const totalWidth = itemWidth * items.length;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime1Ref.current) startTime1Ref.current = timestamp;

      // Only animate if not paused AND not dragging (or if desktop and not paused)
      if (!isPaused1Ref.current && (!isDragging || !isMobile)) {
        const elapsed = timestamp - startTime1Ref.current + pausedAt1Ref.current;
        const distance = (elapsed * autoScrollSpeed) / 1000;
        const rawPosition = -distance;

        if (-rawPosition >= totalWidth) {
          const overflow = -rawPosition - totalWidth;
          startTime1Ref.current = timestamp;
          pausedAt1Ref.current = (overflow * 1000) / autoScrollSpeed;
          x1.set(-overflow);
        } else {
          x1.set(rawPosition);
        }
      } else {
        // If paused or dragging, just record how long we've been paused
        pausedAt1Ref.current = timestamp - startTime1Ref.current + pausedAt1Ref.current;
        startTime1Ref.current = null;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation only if not mobile or if mobile and not actively dragging
    if (!isMobile || !isDragging) {
      animationFrameId = requestAnimationFrame(animate);
    }

    // Cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [extendedItems.length, autoScrollSpeed, x1, isDragging, isMobile]);

  // Restart animation after drag ends on mobile
  useEffect(() => {
    if (!isMobile || !containerRef1.current || extendedItems.length === 0) return;

    // We only want to restart animation when drag has just ended
    if (!isDragging) {
      // Force restart of animation by resetting timing and scheduling next frame
      const restartAnimation = () => {
        if (isPaused1Ref.current || !containerRef1.current) return;

        let animationFrameId: number;

        const itemWidth = 520;
        const totalWidth = itemWidth * items.length;

        const animate = (timestamp: number) => {
          if (!startTime1Ref.current) startTime1Ref.current = timestamp;

          const elapsed = timestamp - startTime1Ref.current + pausedAt1Ref.current;
          const distance = (elapsed * autoScrollSpeed) / 1000;
          const rawPosition = -distance;

          if (-rawPosition >= totalWidth) {
            const overflow = -rawPosition - totalWidth;
            startTime1Ref.current = timestamp;
            pausedAt1Ref.current = (overflow * 1000) / autoScrollSpeed;
            x1.set(-overflow);
          } else {
            x1.set(rawPosition);
          }

          animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        // Clean up any previous frame if running
        return () => cancelAnimationFrame(animationFrameId);
      };

      // Use a timeout to avoid conflict with ongoing drag cleanup
      const timeoutId = setTimeout(restartAnimation, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isDragging, isMobile, extendedItems.length, autoScrollSpeed, x1]);

  // Row 2 Animation (Right to Left)
  useEffect(() => {
    if (!containerRef2.current || extendedItems.length === 0) return
    const itemWidth = 520
    const totalWidth = itemWidth * items.length
    let animationFrameId: number

    const animate = (timestamp: number) => {
      if (!startTime2Ref.current) startTime2Ref.current = timestamp
      if (!isPaused2Ref.current) {
        const elapsed = timestamp - startTime2Ref.current + pausedAt2Ref.current
        const distance = (elapsed * autoScrollSpeed / 1000)
        const rawPosition = -totalWidth + distance

        if (rawPosition >= 0) {
          const overflow = rawPosition
          startTime2Ref.current = timestamp
          pausedAt2Ref.current = overflow * 1000 / autoScrollSpeed
          x2.set(-totalWidth + overflow)
        } else {
          x2.set(rawPosition)
        }
      } else {
        pausedAt2Ref.current = timestamp - startTime2Ref.current + pausedAt2Ref.current
        startTime2Ref.current = null
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [items.length, autoScrollSpeed, x2, extendedItems])

  // Hover handlers
  const handleHoverStart = (row: 1 | 2) => {
    if (!isMobile) {
      if (row === 1) isPaused1Ref.current = true
      else isPaused2Ref.current = true
    }
  }

  const handleHoverEnd = (row: 1 | 2) => {
    if (!isMobile) {
      if (row === 1) isPaused1Ref.current = false
      else isPaused2Ref.current = false
    }
  }

  // Touch interaction
  const handleTouchStart = (row: 1 | 2, itemIndex: number) => {
    if (isMobile && !isDragging) {
      if (touchedItem === itemIndex) {
        setTouchedItem(null)
      } else {
        setTouchedItem(itemIndex)
      }
    }
  }

  // Default fallback items
  const displayItems = useMemo(() => {
    return items.length > 0 ? items : [
      {
        imageSrc: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&q=80',
        title: 'Modern Residential Replacement',
        description: 'Complete roof replacement with GAF Timberline shingles',
        link: '/projects/replacement'
      },
      {
        imageSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        title: 'Storm Damage Repair',
        description: 'Emergency hail damage restoration completed in 48 hours'
      },
      {
        imageSrc: 'https://images.unsplash.com/photo-1565009469665-205e5ba65be2?w=800&q=80',
        title: 'Commercial Project',
        description: 'TPO membrane installation for 50,000 sq ft warehouse'
      },
      {
        imageSrc: 'https://images.unsplash.com/photo-1625047509252-fa38fb206d34?w=800&q=80',
        title: 'Heritage Home Restoration',
        description: 'Slate roof restoration preserving historical integrity'
      },
      {
        imageSrc: 'https://images.unsplash.com/photo-1609528905064-5799fece229a?w=800&q=80',
        title: 'Solar Ready Installation',
        description: 'Modern roofing system with integrated solar mounting'
      },
      {
        imageSrc: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80',
        title: 'Luxury Estate Roofing',
        description: 'Premium architectural shingles with copper accents'
      },
    ]
  }, [items])

  const finalExtendedItems = useMemo(() => {
    const extended = []
    for (let i = 0; i < duplicateCount; i++) {
      extended.push(...displayItems)
    }
    return extended
  }, [displayItems, duplicateCount])

  // Drag constraints
  const itemWidth = isMobile ? 280 : 520
  const gap = isMobile ? 12 : 20
  const totalWidth = (itemWidth + gap) * finalExtendedItems.length
  const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 0
  const maxDrag = 0
  const minDrag = -(totalWidth - containerWidth + 100)

  // Escape key to close lightbox
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  return (
      <>
        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedItem && (
              <motion.div
                  className="fixed inset-0 bg-[#192119] bg-opacity-100 backdrop-blur-sm flex items-center justify-center z-100 p-4 sm:p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedItem(null)}
                  role="dialog"
                  aria-modal="true"
              >
                {/* Modal Container */}
                <motion.div
                    className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center text-center"
                    initial={{ y: 40, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 40, opacity: 0, scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                    transition={{ type: 'spring', stiffness: 300, damping: 35 }}
                >
                  {/* Close Button */}
                  <button
                      aria-label="Close lightbox"
                      className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10 text-lg font-bold"
                      onClick={() => setSelectedItem(null)}
                  >
                    ✕
                  </button>

                  {/* Image */}
                  <motion.div
                      className="overflow-hidden rounded-xl shadow-2xl"
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    <Image
                        src={selectedItem.imageSrc}
                        alt={selectedItem.title}
                        width={1200}
                        height={900}
                        className="w-full max-h-[70vh] object-contain"
                        quality={95}
                        priority
                        style={{ imageRendering: 'auto' }}
                    />
                  </motion.div>

                  {/* Caption */}
                  <motion.div
                      className="mt-6 space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                      {selectedItem.title}
                    </h3>
                    {selectedItem.description && (
                        <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
                          {selectedItem.description}
                        </p>
                    )}
                    {selectedItem.link && (
                        <a
                            href={selectedItem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center mt-4 px-6 py-3 bg-[#40d6d1] text-[#192119] font-semibold rounded-full hover:bg-[#13a19c] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            onClick={(e) => e.stopPropagation()}
                        >
                          View Project
                          <svg
                              className="w-5 h-5 ml-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </a>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel */}
        <section className="relative w-full px-4 sm:px-8 pb-8">
          <div className="relative overflow-hidden">
            {/* Edge fade masks */}
            <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#192119] to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#192119] to-transparent z-20 pointer-events-none" />

            <div className="relative z-10 w-full space-y-2 pt-0">
              {/* First Row - Left to Right */}
              <div
                  ref={constraintsRef}
                  className="relative overflow-visible"
                  onMouseEnter={() => handleHoverStart(1)}
                  onMouseLeave={() => handleHoverEnd(1)}
              >
                <motion.div
                    ref={containerRef1}
                    className={`flex gap-3 sm:gap-5 pt-2 pb-2 ${isMobile ? 'draggable' : ''}`}
                    style={{ x: isMobile ? dragX : x1 }}
                    drag={isMobile ? "x" : false}
                    dragConstraints={isMobile ? { left: minDrag, right: maxDrag } : undefined}
                    dragElastic={0.2}
                    dragMomentum={true}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                    whileDrag={{ cursor: "grabbing" }}
                >
                  {finalExtendedItems.map((item, idx) => (
                      <motion.div
                          key={`row1-${idx}`}
                          className="relative flex-shrink-0 w-[280px] sm:w-[400px] md:w-[500px] h-[180px] sm:h-[240px] md:h-[300px] rounded-xl overflow-hidden group cursor-pointer"
                          whileHover={!isMobile ? { scale: 1.05, zIndex: 10 } : {}}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          style={{ originX: 0.5, originY: 0.5, touchAction: isMobile ? 'pan-y' : 'auto' }}
                          onTouchStart={() => handleTouchStart(1, idx)}
                          onClick={() => setSelectedItem(item)} // ← Click to open lightbox
                          animate={{
                            scale: (isMobile && touchedItem === idx) ? 1.05 : 1,
                            zIndex: (isMobile && touchedItem === idx) ? 10 : 1
                          }}
                      >
                        {/* Image */}
                        <div className="absolute inset-0">
                          <Image
                              src={item.imageSrc}
                              alt={item.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              sizes="(max-width: 768px) 280px, (max-width: 1024px) 400px, 500px"
                              priority={idx < 3}
                              quality={85}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                          <h3 className="text-xs sm:text-sm font-semibold text-white mb-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-white/80 line-clamp-1">
                            {item.description}
                          </p>
                          {item.link && (
                              <motion.a
                                  href={item.link}
                                  className="inline-flex items-center text-xs font-medium text-[#40d6d1] hover:text-[#13a19c] mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                  onClick={(e) => e.stopPropagation()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                              >
                                View Project
                                <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </motion.a>
                          )}
                        </div>

                        {/* Border on hover/touch */}
                        <div
                            className={`absolute inset-0 rounded-xl border border-[#40d6d1] transition-opacity duration-300 pointer-events-none ${
                                (isMobile && touchedItem === idx) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}
                        />
                      </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Second Row - Right to Left (commented out as in original) */}
              {/* <div
              className="relative overflow-visible"
              onMouseEnter={() => handleHoverStart(2)}
              onMouseLeave={() => handleHoverEnd(2)}
            >
              <motion.div
                ref={containerRef2}
                className="flex gap-5 pb-2 pt-2"
                style={{ x: x2 }}
              >
                {finalExtendedItems.map((item, idx) => (
                  <motion.div
                    key={`row2-${idx}`}
                    className="relative flex-shrink-0 w-[275px] h-[160px] rounded-xl overflow-hidden group cursor-pointer"
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    style={{ originX: 0.5, originY: 0.5 }}
                  >
                    <div className="absolute inset-0">
                      <img
                        src={item.imageSrc}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-sm font-semibold text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/80 line-clamp-1">
                        {item.description}
                      </p>
                      {item.link && (
                        <motion.a
                          href={item.link}
                          className="inline-flex items-center text-xs font-medium text-[#40d6d1] hover:text-[#13a19c] mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          onClick={(e) => e.stopPropagation()}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Project
                          <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </motion.a>
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-xl border border-[#40d6d1] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </motion.div>
                ))}
              </motion.div>
            </div> */}
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
        `}</style>
        </section>
      </>
  )
}
