"use client"
import React, { useRef, useEffect, useMemo, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'

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

  useEffect(() => {
    const updateDuplicateCount = () => {
      if (typeof window !== 'undefined') {
        setDuplicateCount(Math.max(4, Math.ceil(window.innerWidth / 250) + 2))
      }
    }
    updateDuplicateCount()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateDuplicateCount)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateDuplicateCount)
      }
    }
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
    if (!containerRef1.current || extendedItems.length === 0) return
    const itemWidth = 520 // 500px card + 20px gap
    const totalWidth = itemWidth * items.length
    let animationFrameId: number

    const animate = (timestamp: number) => {
      if (!startTime1Ref.current) startTime1Ref.current = timestamp
      if (!isPaused1Ref.current) {
        const elapsed = timestamp - startTime1Ref.current + pausedAt1Ref.current
        const distance = (elapsed * autoScrollSpeed / 1000)

        // Calculate position without modulo to avoid jumps
        const rawPosition = -distance

        // When we've scrolled past one full set, reset seamlessly
        if (-rawPosition >= totalWidth) {
          // Reset the start time to current time minus the overflow
          const overflow = -rawPosition - totalWidth
          startTime1Ref.current = timestamp
          pausedAt1Ref.current = overflow * 1000 / autoScrollSpeed
          x1.set(-overflow)
        } else {
          x1.set(rawPosition)
        }
      } else {
        // When paused, record the time offset
        pausedAt1Ref.current = timestamp - startTime1Ref.current + pausedAt1Ref.current
        startTime1Ref.current = null
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [items.length, autoScrollSpeed, x1, extendedItems])

  // Row 2 Animation (Right to Left) - Commented out in your version
  useEffect(() => {
    if (!containerRef2.current || extendedItems.length === 0) return
    const itemWidth = 520 // 500px card + 20px gap
    const totalWidth = itemWidth * items.length
    let animationFrameId: number

    const animate = (timestamp: number) => {
      if (!startTime2Ref.current) startTime2Ref.current = timestamp
      if (!isPaused2Ref.current) {
        const elapsed = timestamp - startTime2Ref.current + pausedAt2Ref.current
        const distance = (elapsed * autoScrollSpeed / 1000)

        // Start from the right and move left
        const rawPosition = -totalWidth + distance

        // When we've scrolled past one full set, reset seamlessly
        if (rawPosition >= 0) {
          // Reset the start time to current time minus the overflow
          const overflow = rawPosition
          startTime2Ref.current = timestamp
          pausedAt2Ref.current = overflow * 1000 / autoScrollSpeed
          x2.set(-totalWidth + overflow)
        } else {
          x2.set(rawPosition)
        }
      } else {
        // When paused, record the time offset
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

  const handleHoverStart = (row: 1 | 2) => {
    if (row === 1) {
      isPaused1Ref.current = true
    } else {
      isPaused2Ref.current = true
    }
  }

  const handleHoverEnd = (row: 1 | 2) => {
    if (row === 1) {
      isPaused1Ref.current = false
    } else {
      isPaused2Ref.current = false
    }
  }

  // Ensure items are passed as props or use default
  const displayItems = items.length > 0 ? items : [
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
  ];

  const finalExtendedItems = useMemo(() => {
    const extended = []
    for (let i = 0; i < duplicateCount; i++) {
      extended.push(...displayItems)
    }
    return extended
  }, [displayItems, duplicateCount])

  return (
      <section className="relative w-screen px-1 pb-8 -mx-4 sm:-mx-8" style={{ left: '-80px' }}>
        {/* Outer container with overflow hidden */}
        <div className="relative overflow-hidden">
          {/* Edge fade masks - moved inside overflow-hidden container and made stronger */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#1a1f1c] to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#1a1f1c] to-transparent z-20 pointer-events-none" />

          <div className="relative z-10 w-full space-y-2 pt-0">
            {/* First Row - Left to Right */}
            <div
                className="relative overflow-visible"
                onMouseEnter={() => handleHoverStart(1)}
                onMouseLeave={() => handleHoverEnd(1)}
            >
              <motion.div
                  ref={containerRef1}
                  className="flex gap-5 pt-2 pb-2"
                  style={{ x: x1 }}
              >
                {finalExtendedItems.map((item, idx) => (
                    <motion.div
                        key={`row1-${idx}`}
                        className="relative flex-shrink-0 w-[500px] h-[300px] rounded-xl overflow-hidden group cursor-pointer"
                        whileHover={{ scale: 1.05, zIndex: 10 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        style={{ originX: 0.5, originY: 0.5 }}
                    >
                      {/* Image Container */}
                      <div className="absolute inset-0">
                        <img
                            src={item.imageSrc}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                        />
                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      </div>
                      {/* Content Overlay - Always at bottom */}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
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
                      {/* Hover Border Effect */}
                      <div className="absolute inset-0 rounded-xl border border-[#40d6d1] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </motion.div>
                ))}
              </motion.div>
            </div>
            {/* Second Row - Right to Left */}
            {/*<div*/}
            {/*  className="relative overflow-visible"*/}
            {/*  onMouseEnter={() => handleHoverStart(2)}*/}
            {/*  onMouseLeave={() => handleHoverEnd(2)}*/}
            {/*>*/}
            {/*  <motion.div*/}
            {/*    ref={containerRef2}*/}
            {/*    className="flex gap-5 pb-2 pt-2"*/}
            {/*    style={{ x: x2 }}*/}
            {/*  >*/}
            {/*    {finalExtendedItems.map((item, idx) => (*/}
            {/*      <motion.div*/}
            {/*        key={`row2-${idx}`}*/}
            {/*        className="relative flex-shrink-0 w-[275px] h-[160px] rounded-xl overflow-hidden group cursor-pointer"*/}
            {/*        whileHover={{ scale: 1.05, zIndex: 10 }}*/}
            {/*        transition={{ type: 'spring', stiffness: 400, damping: 30 }}*/}
            {/*        style={{ originX: 0.5, originY: 0.5 }}*/}
            {/*      >*/}
            {/*        /!* Image Container *!/*/}
            {/*        <div className="absolute inset-0">*/}
            {/*          <img*/}
            {/*            src={item.imageSrc}*/}
            {/*            alt={item.title}*/}
            {/*            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"*/}
            {/*            loading="lazy"*/}
            {/*          />*/}
            {/*          /!* Dark gradient overlay *!/*/}
            {/*          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />*/}
            {/*        </div>*/}
            {/*        /!* Content Overlay - Always at bottom *!/*/}
            {/*        <div className="absolute bottom-0 left-0 right-0 p-4">*/}
            {/*          <h3 className="text-sm font-semibold text-white mb-1">*/}
            {/*            {item.title}*/}
            {/*          </h3>*/}
            {/*          <p className="text-xs text-white/80 line-clamp-1">*/}
            {/*            {item.description}*/}
            {/*          </p>*/}
            {/*          {item.link && (*/}
            {/*            <motion.a*/}
            {/*              href={item.link}*/}
            {/*              className="inline-flex items-center text-xs font-medium text-[#40d6d1] hover:text-[#13a19c] mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300"*/}
            {/*              onClick={(e) => {*/}
            {/*                e.stopPropagation();*/}
            {/*              }}*/}
            {/*              target="_blank"*/}
            {/*              rel="noopener noreferrer"*/}
            {/*            >*/}
            {/*              View Project*/}
            {/*              <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
            {/*                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />*/}
            {/*              </svg>*/}
            {/*            </motion.a>*/}
            {/*          )}*/}
            {/*        </div>*/}
            {/*        /!* Hover Border Effect *!/*/}
            {/*        <div className="absolute inset-0 rounded-xl border border-[#40d6d1] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />*/}
            {/*      </motion.div>*/}
            {/*    ))}*/}
            {/*  </motion.div>*/}
            {/*</div>*/}
          </div>
        </div>

        <style jsx>{`
          /* Ensure smooth rendering */
          @media (prefers-reduced-motion: no-preference) {
            * {
              will-change: transform;
            }
          }
        `}</style>
      </section>
  )
}
