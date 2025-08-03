"use client";
import { motion, AnimatePresence, useAnimationControls, Variants } from "framer-motion";
import React, { useState, useEffect, useRef, useCallback } from "react";
import WorkCarousel, { WorkItem } from './components/WorkCarousel';
import { FaFacebook, FaInstagram, FaGoogle } from 'react-icons/fa';

// --- Hamburger Component (Unchanged) ---
interface HamburgerProps {
  isOpen: boolean;
  onToggle: () => void;
}
function Hamburger({ isOpen, onToggle }: HamburgerProps) {
  return (
      <motion.svg
          onClick={onToggle}
          viewBox="0 0 100 100"
          width="40"
          height="40"
          style={{ originX: "50%", originY: "50%", cursor: "pointer" }}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ rotate: { duration: 0.4, ease: "easeInOut" } }}
      >
        {/* Top line */}
        <motion.path
            d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20"
            fill="none"
            stroke="#fff"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeDasharray="40 160"
            animate={{ strokeDashoffset: isOpen ? -64 : 0 }}
            transition={{ strokeDashoffset: { duration: 0.4, ease: "easeInOut" } }}
        />
        {/* Middle line */}
        <motion.path
            d="m 30,50 h 40"
            fill="none"
            stroke="#fff"
            strokeWidth="5.5"
            strokeLinecap="round"
            style={{ originX: "50%", originY: "50%" }}
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ rotate: { duration: 0.4, ease: "easeInOut" } }}
        />
        {/* Bottom line */}
        <motion.path
            d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20"
            fill="none"
            stroke="#fff"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeDasharray="40 85"
            animate={{ strokeDashoffset: isOpen ? -64 : 0 }}
            transition={{ strokeDashoffset: { duration: 0.4, ease: "easeInOut" } }}
        />
      </motion.svg>
  );
}

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormClosing, setIsFormClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastVideoSection, setPastVideoSection] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    serviceAddress: "",
    services: [] as string[],
    message: "",
  });
  const [errors, setErrors] = useState({
    fullName: false,
    phone: false,
    email: false,
    serviceAddress: false,
  });

  // --- Other state variables (Unchanged) ---
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("/alsaba-house-afternoon.mp4");
  const [nextVideo, setNextVideo] = useState<string | null>(null);
  const [videoQueue, setVideoQueue] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [submitStage, setSubmitStage] = useState<"idle" | "loading" | "success" | "complete">("idle");
  const [rippleOrigin, setRippleOrigin] = useState({x: 0, y: 0});
  const confettiRef = useRef<unknown>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);

  const phoneIconRef = useRef<SVGSVGElement>(null);
  const videoSectionRef = useRef<HTMLElement>(null);

  // --- Animation Controls (Unchanged) ---
  const fullNameControls = useAnimationControls();
  const phoneControls = useAnimationControls();
  const emailControls = useAnimationControls();
  const serviceAddressControls = useAnimationControls();

  // --- Portfolio Items (Unchanged) ---
  const portfolioItems: WorkItem[] = [
    {
      imageSrc: '/luqman-house.jpg',
      title: 'Residential Roof Repair',
      description: 'Repaired damaged shingles and fixed leaking areas'
    },
    {imageSrc: '/ibrahim-house.jpg', title: 'Residential Roof Replacement', description: 'Complete roof replacement with GAF Timberline shingles'},
  ];

  // --- Other useEffect hooks (Unchanged) ---
  // Set --vh for viewport height fallback
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  // Handle mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Phone icon wiggle animation
  useEffect(() => {
    const icon = phoneIconRef.current;
    if (!icon) return;
    const interval = setInterval(() => {
      icon.classList.add("wiggle-once");
      setTimeout(() => icon.classList.remove("wiggle-once"), 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Video selection based on weather and time (Unchanged)
  const pickAndTransitionVideo = useCallback(async () => {
    const now = Date.now() / 1000;
    let isRaining = false;
    let sunrise = 0;
    let sunset = 0;
    try {
      const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Louisville,KY,US&appid=cd8280ddbfb7da4c7d8d21c92d0b165b&units=imperial`
      );
      if (response.ok) {
        const weatherData = await response.json();
        const weatherId = weatherData.weather?.[0]?.id || 0;
        isRaining = weatherId >= 200 && weatherId <= 531;
        sunrise = weatherData.sys.sunrise;
        sunset = weatherData.sys.sunset;
      }
    } catch {
      // Silent fallback
    }
    let newVideo = "";
    if (isRaining) {
      newVideo = "/alsaba-house-rainy.mp4";
    } else if (now >= sunset - 3600 && now < sunset) {
      newVideo = "/alsaba-house-sunset.mp4";
    } else if (now >= sunset || now < sunrise) {
      newVideo = "/alsaba-house-night.mp4";
    } else {
      const hour = Number(
          new Intl.DateTimeFormat("en-US", {
            hour12: false,
            hour: "numeric",
            timeZone: "America/Kentucky/Louisville",
          }).format(new Date())
      );
      newVideo = hour < 12 ? "/alsaba-house-morning.mp4" : "/alsaba-house-afternoon.mp4";
    }
    if (newVideo !== currentVideo && newVideo !== videoQueue && !isTransitioning) {
      setVideoQueue(newVideo);
    }
  }, [currentVideo, videoQueue, isTransitioning]);

  useEffect(() => {
    pickAndTransitionVideo();
    const intervalId = setInterval(pickAndTransitionVideo, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [pickAndTransitionVideo]);

// Preload next video (Unchanged)
  useEffect(() => {
    if (!videoQueue) return;
    const nextVidElement = document.createElement("video");
    nextVidElement.src = videoQueue;
    nextVidElement.muted = true;
    const handleLoaded = () => {
      setNextVideo(videoQueue);
      setIsTransitioning(true);
      nextVidElement.removeEventListener("canplaythrough", handleLoaded);
    };
    nextVidElement.addEventListener("canplaythrough", handleLoaded);
    nextVidElement.load();
  }, [videoQueue]);

// Transition to next video (Unchanged)
  useEffect(() => {
    if (!isTransitioning || !nextVideo) return;
    const transitionTimer = setTimeout(() => {
      setCurrentVideo(nextVideo);
      setNextVideo(null);
      setVideoQueue(null);
      setIsTransitioning(false);
    }, 1500);
    return () => clearTimeout(transitionTimer);
  }, [isTransitioning, nextVideo]);

// Handle scroll detection for video section detection (Unchanged)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setScrolled(scrollY > 20);
          // Check if we've scrolled past the video section
          if (videoSectionRef.current) {
            const videoSectionRect = videoSectionRef.current.getBoundingClientRect();
            const videoSectionBottom = videoSectionRect.bottom;
            setPastVideoSection(videoSectionBottom <= 100); // When video section is 100px or less from top
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, {passive: true});
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

// Mouse movement for parallax effect (Unchanged)
  useEffect(() => {
    let targetX = 0,
        targetY = 0,
        currentX = 0,
        currentY = 0;
    let animationId: number;
    const lerpFactor = 0.08;
    const handleMouseMove = (e: MouseEvent) => {
      const {clientX, clientY} = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetX = (clientX - centerX) / centerX;
      targetY = (clientY - centerY) / centerY;
    };
    const animate = () => {
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;
      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        setMousePosition({x: currentX, y: currentY});
      }
      animationId = requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", handleMouseMove, {passive: true});
    animationId = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

// Email validation helper function (Unchanged)
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

// Handle input changes (Simplified - removed Google Maps specific logic)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
    // Clear errors when user starts typing, but validate email format in real-time
    if (name === "email") {
      // Ensure we always return a boolean: show error if value exists and is invalid
      const hasError = value.trim().length > 0 && !isValidEmail(value);
      setErrors((prev) => ({...prev, email: hasError}));
    } else {
      // For other fields (including serviceAddress), clear error on input
      setErrors((prev) => ({...prev, [name]: false}));
    }
  };

  const handleCheckboxChange = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service) ? prev.services.filter((s) => s !== service) : [...prev.services, service],
    }));
  };

  const ejectConfetti = async () => {
    if (!confettiRef.current) {
      const {default: load} = await import("canvas-confetti");
      confettiRef.current = load;
    }
    const confetti = confettiRef.current as { (options: unknown): void };
    const btn = submitBtnRef.current;
    let origin = {x: 0.5, y: 0.6};
    if (btn) {
      const rect = btn.getBoundingClientRect();
      origin = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };
    }
    confetti({
      particleCount: 40,
      startVelocity: 35,
      spread: 60,
      ticks: 100,
      origin,
      colors: ["#13A19C", "#FFC34A", "#FFFFFF", "#4FC3F7", "#A1E3D8"],
    });
  };

  const handleCloseForm = () => {
    setIsFormClosing(true);
    setTimeout(() => {
      setIsFormOpen(false);
      setIsFormClosing(false);
      setFormStep(1);
      setIsSubmitted(false);
      setSubmitStage("idle");
      setErrors({fullName: false, phone: false, email: false, serviceAddress: false});
    }, 500);
  };

  const handleNextStep = async () => {
    // --- Updated validation logic ---
    // Check for errors including serviceAddress
    const newErrors = {
      fullName: !formData.fullName.trim(), // Add trim check
      phone: !formData.phone.trim(),
      email: !formData.email.trim() || !isValidEmail(formData.email),
      serviceAddress: !formData.serviceAddress.trim(), // Add trim check
    };
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      // --- Animation triggers (Unchanged) ---
      if (newErrors.fullName)
        fullNameControls.start({
          x: [0, -3, 3, -3, 3, -1.5, 1.5, 0],
          transition: {duration: 0.52, times: [0, 0.15, 0.3, 0.45, 0.55, 0.7, 0.85, 1], ease: "easeInOut"},
        });
      if (newErrors.phone)
        phoneControls.start({
          x: [0, -3, 3, -3, 3, -1.5, 1.5, 0],
          transition: {duration: 0.52, times: [0, 0.15, 0.3, 0.45, 0.55, 0.7, 0.85, 1], ease: "easeInOut"},
        });
      if (newErrors.email)
        emailControls.start({
          x: [0, -3, 3, -3, 3, -1.5, 1.5, 0],
          transition: {duration: 0.52, times: [0, 0.15, 0.3, 0.45, 0.55, 0.7, 0.85, 1], ease: "easeInOut"},
        });
      if (newErrors.serviceAddress) // Trigger animation for address
        serviceAddressControls.start({
          x: [0, -3, 3, -3, 3, -1.5, 1.5, 0],
          transition: {duration: 0.52, times: [0, 0.15, 0.3, 0.45, 0.55, 0.7, 0.85, 1], ease: "easeInOut"},
        });
      return;
    }
    setFormStep(2);
  };

  const handlePreviousStep = () => {
    setFormStep(1);
    setErrors({fullName: false, phone: false, email: false, serviceAddress: false});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStage("loading");
    // Capture ripple effect origin for button animation
    if (submitBtnRef.current) {
      const rect = submitBtnRef.current.getBoundingClientRect();
      setRippleOrigin({
        x: rect.width / 2,
        y: rect.height / 2
      });
    }
    try {
      const res = await fetch("https://formspree.io/f/xdkdapno", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          serviceAddress: formData.serviceAddress, // Include address in submission
          services: formData.services.join(", "),
          message: formData.message,
          // Additional metadata for the email
          _subject: "New Consultation Request - Onyx Roofing",
          _replyto: formData.email,
          _format: "plain"
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit form");
      }
      // Success! Fire confetti and transition to success state
      setSubmitStage("success");
      await ejectConfetti();
      // Small delay before showing completion screen
      setTimeout(() => {
        setSubmitStage("complete");
        setIsSubmitted(true);
      }, 400);
    } catch (err) {
      console.error("Form submission error:", err);
      setSubmitStage("idle");
      // User-friendly error handling
      alert("Sorry, there was an error submitting your request. Please try again or call us directly at 502-207-3007.");
    }
  };

  const handleViewRequests = () => {
    console.log("Navigating to requests...");
    handleCloseForm();
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      serviceAddress: "",
      services: [],
      message: "",
    });
  };

  const progressBarVariants: Variants = {
    hidden: {width: "0%"},
    visible: {
      width: isSubmitted ? "100%" : formStep === 2 ? "50%" : "0%",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

// --- New function for smooth scrolling ---
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault(); // Prevent the default anchor jump
    // Find the target element by its ID (remove the '#')
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // Use the browser's native smooth scrolling
      targetElement.scrollIntoView({
        behavior: 'smooth', // This enables smooth scrolling
        block: 'start',     // Aligns the top of the element with the top of the viewport
        inline: 'nearest'   // Aligns horizontally if needed
      });
      // If it's a mobile menu item, close the menu after clicking
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    }
  };

  return (
      <div className="font-inter antialiased overflow-x-hidden"
           style={{fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}>
        <main
            ref={videoSectionRef}
            className="h-dynamic text-white relative overflow-hidden"
            style={{
              border: isMobile ? "8px solid #192119" : "16px solid #192119",
              background: "#192119",
              borderRadius: "0px",
              maxWidth: "100vw",
              touchAction: "auto", // Allow normal touch scrolling
            }}
        >
          <div className="relative h-full overflow-hidden" style={{borderRadius: "32px 32px 0 0", maxWidth: "100%"}}>
            <canvas id="confetti-canvas" className="absolute inset-0 pointer-events-none" style={{zIndex: 100}}/>
            <motion.div className="absolute inset-0 overflow-hidden" style={{backgroundColor: "#192119"}}
                        animate={{scale: scrolled ? 1.02 : 1}} transition={{duration: 0.52, ease: "easeOut"}}>
              <motion.video
                  key={`current-${currentVideo}`}
                  ref={videoRef}
                  className="house-background absolute w-full will-change-transform object-cover"
                  style={{
                    filter: "blur(5px) brightness(1) saturate(0.75)",
                    transform: isMobile ? "scale(1.05)" : `scale(1.08) translate3d(${mousePosition.x * -50}px, calc(${(mousePosition.y * -15) - 10}px + var(--scroll-offset, 10px)), 0)`,
                    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.6) 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.6) 100%)",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  initial={{opacity: 0}}
                  animate={{opacity: isTransitioning ? 0 : 1}}
                  transition={{duration: 1.5, ease: "easeInOut"}}
                  autoPlay
                  loop
                  muted
                  playsInline
              >
                <source src={currentVideo} type="video/mp4"/>
              </motion.video>
              <motion.video
                  key={`next-${nextVideo || currentVideo}`}
                  ref={nextVideoRef}
                  className="house-background absolute w-full will-change-transform object-cover"
                  style={{
                    filter: "blur(5px) brightness(1) saturate(0.75)",
                    transform: isMobile ? "scale(1.05)" : `scale(1.08) translate3d(${mousePosition.x * -50}px, calc(${(mousePosition.y * -15) - 10}px + var(--scroll-offset, 0px)), 0)`,
                    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.6) 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.6) 100%)",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  initial={{opacity: 0}}
                  animate={{opacity: isTransitioning ? 1 : 0}}
                  transition={{duration: 1.5, ease: "easeInOut"}}
                  autoPlay
                  loop
                  muted
                  playsInline
              >
                <source src={nextVideo || currentVideo} type="video/mp4"/>
              </motion.video>
              <div
                  className="hidden md:block absolute top-1/3 left-1/4 w-96 h-96 bg-[#13938f]/3 rounded-full blur-[120px] animate-pulse-slow will-change-[opacity]"/>
              <div
                  className="hidden md:block absolute bottom-1/3 right-1/3 w-96 h-96 bg-white/3 rounded-full blur-[100px] animate-pulse-slower will-change-[opacity]"/>
            </motion.div>
            <div className="relative z-100 pb-16 md:pb-0">
              {/* Static Navigation - only visible in hero section */}
              <motion.nav
                  className="absolute top-0 left-0 right-0 z-40 py-6 md:py-10"
                  initial={{y: -100, opacity: 0}}
                  animate={{y: 0, opacity: 1}}
                  transition={{duration: 0.8, ease: [0.25, 0.1, 0.25, 1]}}
              >
                <div className="max-w-7xl mx-auto px-12 pt-0 sm:px-8 flex items-center justify-between">
                  <motion.img
                      src="/onyx-roofing-logo-black.png"
                      alt="Onyx Roofing"
                      className="h-10 sm:h-13 w-auto brightness-0 invert"
                      whileHover={{scale: 1.03}}
                      transition={{duration: 0.2}}
                  />
                  <div className="hidden md:flex items-center gap-8">
                    {/* Modified Desktop Nav */}
                    {["Services", "Projects", "About", "Contact"].map((item, index) => {
                      const targetId = item.toLowerCase(); // Get the ID (e.g., 'services')
                      return (
                          <motion.a
                              key={item}
                              href={`#${targetId}`} // Keep href for accessibility/SEO
                              onClick={(e) => handleNavClick(e, targetId)} // Add onClick handler
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
                  <div className="md:hidden">
                    <Hamburger
                        isOpen={isMenuOpen}
                        onToggle={() => setIsMenuOpen(o => !o)}
                    />
                  </div>
                </div>
                <AnimatePresence>
                  {isMenuOpen && (
                      <motion.div
                          className="fixed inset-0 z-30 bg-[#2a2d31] overflow-hidden"
                          style={{paddingTop: "env(safe-area-inset-top)"}}
                          initial={{y: "100%", scale: 0.95, opacity: 0}}
                          animate={{y: 0, scale: 1, opacity: 1}}
                          exit={{y: "100%", scale: 0.95, opacity: 0}}
                          transition={{
                            y: {duration: 0.52, ease: [0.32, 0.72, 0, 1]},
                            scale: {duration: 0.5, ease: [0.32, 0.72, 0, 1]},
                            opacity: {duration: 0.4, ease: "easeOut"},
                          }}
                      >
                        <div className="h-full flex flex-col items-center justify-center space-y-6 px-6">
                          {/* Modified Mobile Nav */}
                          {["Services", "Projects", "About", "Contact"].map((item, i) => {
                            const targetId = item.toLowerCase(); // Get the ID (e.g., 'services')
                            return (
                                <motion.a
                                    key={item}
                                    href={`#${targetId}`} // Keep href for accessibility/SEO
                                    onClick={(e) => handleNavClick(e, targetId)} // Use the new handler
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
              <section className="relative h-full flex items-center justify-center px-4 sm:px-8">
                <AnimatePresence mode="wait">
                  {!isFormOpen ? (
                      <motion.div
                          key="hero-content"
                          className="relative z-20 text-left mx-auto px-4 max-w-md sm:max-w-lg md:max-w-4xl pt-40 w-full"
                          initial={{opacity: 1, scale: 1}}
                          exit={{opacity: 0, scale: 0.95}}
                          transition={{duration: 0.15, ease: "easeOut"}}
                      >
                        <motion.div initial={{opacity: 0, y: 60}} animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.8, ease: [0.25, 0.1, 0.25, 1]}}>
                          <h1 className="text-2xl sm:text-2xl md:text-4xl lg:text-6xl font-light leading-tight"
                              style={{textAlign: "left", textShadow: "-0px 0px 3px rgba(0,0,0, .32)"}}>
                        <span className="block text-white mb-1 sm:mb-3 tracking-wide"
                              style={{mixBlendMode: "difference"}}>
                          Built to <span className="font-normal"
                                         style={{mixBlendMode: "difference", color: "#40d6d1"}}>Withstand.</span>
                        </span>
                            <span className="block text-white tracking-wide" style={{mixBlendMode: "difference"}}>
                          Designed to <span className="font-normal"
                                            style={{mixBlendMode: "difference", color: "#40d6d1"}}>Impress.</span>
                        </span>
                          </h1>
                        </motion.div>
                        <motion.p
                            className="mt-6 sm:mt-10 text-sm sm:text-base md:text-lg text-white/80 max-w-md sm:max-w-lg md:max-w-2xl leading-relaxed font-light"
                            initial={{opacity: 0, y: 40}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.2, duration: 0.7, ease: [0.25, 0.1, 0.25, 1]}}
                        >
                          Your trusted roofing professionals serving Louisville and all of Kentucky.
                          {!isMobile ?
                              <span className="block mt-1">Premium craftsmanship for discerning homeowners.</span> : ''}
                        </motion.p>
                        <motion.div
                            className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-start items-start"
                            initial={{opacity: 0, y: 40}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1]}}>
                          <button
                              onClick={() => setIsFormOpen(true)}
                              className="group relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-[#13a19c] hover:bg-[#0f7a76] text-white font-normal rounded-full transition-all duration-300 flex items-center cursor-pointer text-sm sm:text-base transform-gpu"
                          >
                            <span className="mr-3">Schedule Free Inspection</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                          </button>
                          <motion.a
                              href="#portfolio"
                              onClick={(e) => handleNavClick(e, "portfolio")}
                              className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 border border-white/50 text-white hover:bg-white hover:text-gray-900 font-normal rounded-full transition-all duration-300 cursor-pointer text-sm sm:text-base transform-gpu"
                              style={{backdropFilter: "blur(20px)"}}
                          >
                            View Our Work
                          </motion.a>
                        </motion.div>
                        <motion.div
                            className="mt-8 sm:mt-16 grid grid-cols-2 sm:flex sm:flex-wrap justify-start items-stretch gap-2 sm:gap-3 text-xs sm:text-sm"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: 0.6, duration: 0.7}}>
                          {["Licensed & Insured", "Free Inspection", "Kentucky Owned", "Family Business"]
                              .filter(item =>
                                  // if mobile, drop those two
                                  !(isMobile && (item === "Kentucky Owned" || item === "Family Business"))
                              )
                              .map((item, index) => (
                                  <motion.span
                                      key={item}
                                      className="inline-flex items-center gap-2 text-white/90 font-light px-2 sm:px-3 py-1 sm:py-2 bg-[#474747]/30 backdrop-blur-md h-full transform-gpu"
                                      initial={{opacity: 0, y: 20}}
                                      animate={{opacity: 1, y: 0}}
                                      transition={{delay: 0.7 + index * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
                                      style={{borderRadius: "16px", border: "2px solid rgba(200,200,200,0.04)"}}
                                  >
                                    <span className="text-sm">✓</span>
                                    <span>{item}</span>
                                  </motion.span>
                              ))}
                        </motion.div>
                      </motion.div>
                  ) : null /* Content removed here - form moved outside */}
                </AnimatePresence>
              </section>
            </div>
          </div>
          <motion.a
              href="tel:5022073007"
              className="fixed bottom-0 inset-x-0 bg-[#192119] text-white text-center py-4 z-20 flex items-center justify-center"
              style={{
                borderRadius: "0",
                background: "#192119",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                maxWidth: "100vw"
              }}
              initial={{y: 0, opacity: 1}}
              animate={{
                y: pastVideoSection ? 100 : 0,
                opacity: pastVideoSection ? 0 : 1
              }}
              transition={{duration: 0.3, ease: "easeInOut"}}
          >
            <svg ref={phoneIconRef} className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                  d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-1C7.82 18 2 12.18 2 5V3z"/>
            </svg>
            <span className="font-semibold text-lg sm:text-xl" style={{backgroundColor: "#192119"}}>
            Call us at 502-207-3007
          </span>
          </motion.a>
        </main>

        {/* ========== MOVED FORM RENDERING HERE ========== */}
        {/* Place the entire AnimatePresence block for the form here, outside the main hero section */}
        <AnimatePresence mode="wait">
          {isFormOpen && (
              <motion.div
                  key="form-overlay"
                  className="fixed inset-0 z-50 pointer-events-auto bg-[#2a2d31] overflow-hidden" // Increased z-index to z-50
                  initial={{y: "100%", scale: 0.95, opacity: 0}}
                  animate={{
                    y: isFormClosing ? "100%" : 0,
                    scale: isFormClosing ? 0.95 : 1,
                    opacity: isFormClosing ? 0 : 1,
                  }}
                  exit={{y: "100%", scale: 0.95, opacity: 0}}
                  transition={{
                    y: {duration: 0.52, ease: [0.32, 0.72, 0, 1]},
                    scale: {duration: 0.5, ease: [0.32, 0.72, 0, 1]},
                    opacity: {duration: 0.4, ease: "easeOut"},
                  }}
                  style={{
                    borderRadius: "0 0 0 0",
                    bottom: "env(safe-area-inset-bottom)",
                    maxWidth: "100vw",
                    height: "100dvh"
                  }}
              >
                <motion.div className="absolute inset-0 bg-[#2a2d31]/92 backdrop-blur-2xl"
                            initial={{backdropFilter: "blur(0px)"}} animate={{backdropFilter: "blur(24px)"}}
                            transition={{duration: 0.52, ease: "easeOut"}}/>
                <motion.div
                    className="relative h-full flex items-center justify-center p-4 sm:p-8 mt-3 overflow-y-auto"
                    style={{maxHeight: "100dvh", maxWidth: "100vw"}}
                    initial={{y: 20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.3, duration: 0.5, ease: "easeOut"}}
                >
                  <motion.div className="w-full max-w-lg mx-auto">
                    <AnimatePresence mode="wait">
                      {submitStage !== "complete" ? (
                          <motion.div key="form-content" className="relative" exit={{opacity: 0, y: -20}}
                                      transition={{duration: 0.3}}>
                            <motion.div className="mb-4" initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}}
                                        transition={{delay: 0.4, duration: 0.5}}>
                              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-1">Schedule Your
                                Consultation</h2>
                              <p className="text-xs sm:text-sm text-gray-400">
                                Step {formStep} of 2: {formStep === 1 ? "Your Information" : "Services & Details"}
                              </p>
                            </motion.div>
                            <motion.div className="space-y-4" initial={{opacity: 0}} animate={{opacity: 1}}
                                        transition={{delay: 0.5, duration: 0.5}}>
                              <motion.div className="w-full bg-[#3a3f45] rounded-full h-1 mb-5" initial="hidden"
                                          animate="visible">
                                <motion.div className="h-1 bg-[#13a19c] rounded-full" variants={progressBarVariants}
                                            initial="hidden" animate="visible"/>
                              </motion.div>
                              <AnimatePresence mode="wait">
                                {formStep === 1 ? (
                                    <motion.div key="step1" initial={{x: 50, opacity: 0}} animate={{x: 0, opacity: 1}}
                                                exit={{x: -50, opacity: 0}}
                                                transition={{duration: 0.3, ease: "easeOut"}}>
                                      <div className="space-y-4">
                                        <motion.div animate={fullNameControls}>
                                          <label className="block text-xs font-medium text-gray-300 mb-1">Name</label>
                                          <input
                                              type="text"
                                              name="fullName"
                                              placeholder="Enter your full name"
                                              value={formData.fullName}
                                              onChange={handleInputChange}
                                              className={`w-full px-3 py-2 bg-[#3a3f45] border ${errors.fullName ? "border-red-500" : "border-[#4a4f55]"} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                              aria-invalid={errors.fullName ? "true" : "false"}
                                              aria-describedby={errors.fullName ? "fullName-error" : undefined}
                                          />
                                          <div className="h-1">{errors.fullName &&
                                              <p id="fullName-error" className="text-xs text-red-400">Please enter your
                                                full name</p>}</div>
                                        </motion.div>
                                        <div className="grid grid-cols-2 gap-3">
                                          <motion.div animate={phoneControls}>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">Phone
                                              Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="(502) 000-0000"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 bg-[#3a3f45] border ${errors.phone ? "border-red-500" : "border-[#4a4f55]"} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                                aria-invalid={errors.phone ? "true" : "false"}
                                                aria-describedby={errors.phone ? "phone-error" : undefined}
                                            />
                                            <div className="h-1">{errors.phone &&
                                                <p id="phone-error" className="text-xs text-red-400">Please enter your
                                                  phone number</p>}</div>
                                          </motion.div>
                                          <motion.div animate={emailControls}>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">Email
                                              Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="your@email.com"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 bg-[#3a3f45] border ${errors.email ? "border-red-500" : "border-[#4a4f55]"} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                                aria-invalid={errors.email ? "true" : "false"}
                                                aria-describedby={errors.email ? "email-error" : undefined}
                                            />
                                            <div className="h-1">{errors.email && <p id="email-error"
                                                                                     className="text-xs text-red-400">{!formData.email ? "Please enter your email address" : "Please enter a valid email address"}</p>}</div>
                                          </motion.div>
                                        </div>
                                        {/* --- Service Address Input (Modified) --- */}
                                        <motion.div animate={serviceAddressControls}>
                                          <label className="block text-xs font-medium text-gray-300 mb-1">Service
                                            Address</label>
                                          <div style={{position: "relative", overflow: "visible"}}>
                                            {/* Removed ref={autocompleteRef} */}
                                            <input
                                                type="text"
                                                name="serviceAddress"
                                                placeholder="Enter your address..." // Changed placeholder
                                                value={formData.serviceAddress}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 bg-[#3a3f45] border ${errors.serviceAddress ? "border-red-500" : "border-[#4a4f55]"} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                                aria-invalid={errors.serviceAddress ? "true" : "false"}
                                                aria-describedby={errors.serviceAddress ? "serviceAddress-error" : undefined}
                                            />
                                            <div className="h-1">
                                              {errors.serviceAddress &&
                                                  <p id="serviceAddress-error" className="text-xs text-red-400">Please
                                                    enter a service address</p>}
                                              {/* Removed googleMapsError display */}
                                            </div>
                                          </div>
                                        </motion.div>
                                      </div>
                                    </motion.div>
                                ) : (
                                    // --- Step 2 (Unchanged) ---
                                    <motion.div key="step2" initial={{x: 50, opacity: 0}} animate={{x: 0, opacity: 1}}
                                                exit={{x: -50, opacity: 0}}
                                                transition={{duration: 0.3, ease: "easeOut"}}>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-4">Services
                                          Needed</label>
                                        <motion.div layout className="grid grid-cols-2 gap-2"
                                                    style={{textAlign: "left"}}>
                                          {["Shingle Repair", "Roof Inspection", "Complete Replacement", "Storm Damage", "Leak Repair", "Emergency Service"].map((service) => {
                                            const selected = formData.services.includes(service);
                                            return (
                                                <motion.button
                                                    key={service}
                                                    layout
                                                    type="button"
                                                    onClick={() => handleCheckboxChange(service)}
                                                    className={`relative overflow-visible w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border shadow-sm ${
                                                        selected ? "bg-[#5c9c5f]/50 text-[#fefefe] border-[#a1b5a1]/50" : "bg-[#2d2f34] text-gray-300 border-[#4a4f55] hover:bg-[#383b40]"
                                                    }`}
                                                >
                                                  {service === "Roof Inspection" && (
                                                      <span
                                                          className="absolute px-2 py-0 text-[11px] font-semibold bg-[#c78a36]/60 text-white/80 rounded-t-sm shadow-lg shadow-black/50 z-10"
                                                          style={{
                                                            boxShadow: "inset 0 -4px 8px -4px rgba(0, 0, 0, 0.9)",
                                                            fontSize: "11px",
                                                            borderRadius: "2px 2px 0 0",
                                                            top: "-17px",
                                                            right: "8px"
                                                          }}
                                                      >
                                            Popular
                                          </span>
                                                  )}
                                                  <span>{service}</span>
                                                  <AnimatePresence initial={false} mode="wait">
                                                    {selected && (
                                                        <motion.span
                                                            key="check"
                                                            initial={{scale: 0.5, opacity: 0, rotate: -64}}
                                                            animate={{scale: 1, opacity: 1, rotate: 0}}
                                                            exit={{scale: 0.5, opacity: 0, rotate: 32}}
                                                            transition={{duration: 0.25, ease: "easeOut"}}
                                                            className="ml-2 w-5 h-5 flex items-center justify-center rounded-full bg-[#3f8c42]"
                                                        >
                                                          <svg className="w-3 h-3 text-[#fefefe]" fill="none"
                                                               stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth={3} d="M5 13l4 4L19 7"/>
                                                          </svg>
                                                        </motion.span>
                                                    )}
                                                  </AnimatePresence>
                                                </motion.button>
                                            );
                                          })}
                                        </motion.div>
                                      </div>
                                      <motion.div layout className="mt-4">
                                        <motion.button
                                            layout
                                            onClick={() => setShowDetails((open) => !open)}
                                            className="w-full flex items-center justify-between p-2 bg-[#3a3f45] border border-[#4a4f55] rounded-lg hover:bg-[#404550] transition-colors duration-200"
                                        >
                                          <span className="text-xs font-medium text-gray-300">Additional Details</span>
                                          <motion.svg className="w-4 h-4 text-gray-400" fill="none"
                                                      stroke="currentColor" viewBox="0 0 24 24"
                                                      animate={{rotate: showDetails ? 180 : 0}}
                                                      transition={{duration: 0.2}}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M19 9l-7 7-7-7"/>
                                          </motion.svg>
                                        </motion.button>
                                        <AnimatePresence initial={false}>
                                          {showDetails && (
                                              <motion.div
                                                  key="details-content"
                                                  layout
                                                  initial={{opacity: 0, height: 0}}
                                                  animate={{opacity: 1, height: "auto"}}
                                                  exit={{opacity: 0, height: 0}}
                                                  transition={{duration: 0.3, ease: "easeInOut"}}
                                                  className="overflow-hidden mt-2"
                                              >
                                      <textarea
                                          name="message"
                                          value={formData.message}
                                          onChange={handleInputChange}
                                          rows={3}
                                          placeholder="Tell us more about your project..."
                                          className="w-full px-3 py-2 bg-[#3a3f45] border border-[#4a4f55] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                      />
                                              </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </motion.div>
                                    </motion.div>
                                )}
                              </AnimatePresence>
                              <div className="pt-2 flex gap-3">
                                <button
                                    onClick={formStep === 1 ? handleCloseForm : handlePreviousStep}
                                    className="w-1/3 px-4 py-2 bg-[#3a3f45] hover:bg-[#4a4f55] cursor-pointer text-white rounded-lg transition-all duration-200 font-medium text-sm flex items-center justify-center"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                                  </svg>
                                  {formStep === 1 ? "Back" : "Previous"}
                                </button>
                                {formStep === 1 ? (
                                    <button onClick={handleNextStep}
                                            className="flex-1 px-4 py-2 bg-[#13a19c] hover:bg-[#0f7a76] cursor-pointer text-white rounded-lg transition-all duration-200 font-medium text-sm">
                                      Next
                                    </button>
                                ) : (
                                    <motion.button
                                        ref={submitBtnRef}
                                        onClick={handleSubmit}
                                        disabled={submitStage !== "idle"}
                                        className="flex-1 relative px-4 py-2 bg-[#13a19c] hover:bg-[#0f7a76] disabled:hover:bg-[#13a19c] cursor-pointer disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 font-medium text-sm overflow-hidden"
                                        whileTap={submitStage === "idle" ? {scale: 0.97} : {}}
                                    >
                                      <AnimatePresence>
                                        {submitStage !== "idle" && (
                                            <motion.span
                                                className="absolute inset-0 bg-white/20"
                                                initial={{
                                                  scale: 0,
                                                  opacity: 1,
                                                  borderRadius: "50%",
                                                  width: "20px",
                                                  height: "20px",
                                                  left: rippleOrigin.x - 10,
                                                  top: rippleOrigin.y - 10
                                                }}
                                                animate={{
                                                  scale: 20,
                                                  opacity: 0,
                                                  transition: {duration: 0.52, ease: [0.4, 0.0, 0.2, 1]}
                                                }}
                                                exit={{opacity: 0}}
                                            />
                                        )}
                                      </AnimatePresence>
                                      <AnimatePresence mode="wait">
                                        {submitStage === "idle" && (
                                            <motion.span key="idle" initial={{opacity: 0, y: 20}}
                                                         animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}}
                                                         transition={{duration: 0.2}} className="relative z-10">
                                              Submit Request
                                            </motion.span>
                                        )}
                                        {(submitStage === "loading" || submitStage === "success") && (
                                            <motion.div key="loading" initial={{scale: 0, opacity: 0}}
                                                        animate={{scale: 1, opacity: 1}} exit={{scale: 0, opacity: 0}}
                                                        transition={{duration: 0.2, ease: "easeOut"}}
                                                        className="absolute inset-0 flex items-center justify-center">
                                              <AnimatePresence mode="wait">
                                                {submitStage === "loading" &&
                                                    <motion.div key="spinner" initial={{opacity: 0}}
                                                                animate={{opacity: 1}} exit={{opacity: 0}}
                                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>}
                                                {submitStage === "success" && (
                                                    <motion.svg
                                                        key="checkmark"
                                                        className="w-4 h-4 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        initial={{pathLength: 0, opacity: 0}}
                                                        animate={{pathLength: 1, opacity: 1}}
                                                        transition={{
                                                          pathLength: {duration: 0.3, ease: "easeInOut"},
                                                          opacity: {duration: 0.1}
                                                        }}
                                                    >
                                                      <motion.path strokeLinecap="round" strokeLinejoin="round"
                                                                   strokeWidth={3} d="M5 13l4 4L19 7"
                                                                   initial={{pathLength: 0}} animate={{pathLength: 1}}
                                                                   transition={{duration: 0.3, ease: "easeInOut"}}/>
                                                    </motion.svg>
                                                )}
                                              </AnimatePresence>
                                            </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </motion.button>
                                )}
                              </div>
                            </motion.div>
                          </motion.div>
                      ) : (
                          // --- Success Screen (Unchanged) ---
                          <motion.div
                              key="success-content"
                              initial={{opacity: 0, scale: 0.9, y: 20}}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                transition: {type: "spring", stiffness: 300, damping: 25, delay: 0.1}
                              }}
                              exit={{opacity: 0, scale: 0.9, y: -20}}
                              className="text-center"
                              aria-live="polite"
                          >
                            <motion.div initial={{scale: 0.5, opacity: 0}} animate={{
                              scale: 1,
                              opacity: 1,
                              transition: {type: "spring", stiffness: 300, damping: 20, delay: 0.2}
                            }}
                                        className="w-16 h-16 bg-[#13a19c]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-[#13a19c]" fill="none" stroke="currentColor"
                                   viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                              </svg>
                            </motion.div>
                            <motion.h3 initial={{y: 20, opacity: 0}}
                                       animate={{y: 0, opacity: 1, transition: {duration: 0.3, delay: 0.3}}}
                                       className="text-xl sm:text-2xl font-semibold text-white mb-2">
                              Request Booked!
                            </motion.h3>
                            <motion.p initial={{y: 20, opacity: 0}}
                                      animate={{y: 0, opacity: 1, transition: {duration: 0.3, delay: 0.4}}}
                                      className="text-gray-400 mb-6 text-sm sm:text-base">
                              We'll be in touch shortly to confirm your consultation details.
                            </motion.p>
                            <motion.button
                                initial={{y: 20, opacity: 0}}
                                animate={{
                                  y: 0,
                                  opacity: 1,
                                  transition: {type: "spring", stiffness: 300, damping: 25, delay: 0.5}
                                }}
                                onClick={handleViewRequests}
                                className="w-full px-6 py-3 bg-[#13a19c] hover:bg-[#0f7a76] text-white rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
                            >
                              Return to Home
                            </motion.button>
                          </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>
        {/* ========== END OF MOVED FORM RENDERING ========== */}

        {/* Portfolio Section */}
        <section id="portfolio"
                 className="relative py-16 px-4 sm:px-8 bg-gradient-to-br from-[#192119] to-[#192119] overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div
                className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#40d6d1]/10 rounded-full blur-[150px] animate-pulse-slow"/>
            <div
                className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-[#13938f]/15 rounded-full blur-[120px] animate-pulse-slower"/>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.div
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: "-100px"}}
                transition={{duration: 0.8, ease: [0.25, 0.1, 0.25, 1]}}
                className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-4">
                View Our <span className="font-normal text-[#40d6d1]">Work</span>
              </h2>
              <p className="text-base text-white/70 max-w-xl mx-auto">
                Quality craftsmanship that speaks for itself
              </p>
            </motion.div>
            <WorkCarousel items={portfolioItems}/>
            {/* Call to Action */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1]}}
                className="text-center mt-4"
            >
              <h3 className="text-xl text-white mb-4">Ready to Start Your Project?</h3>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                Proudly Kentucky-based roofers. Schedule your free inspection today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center px-6 py-3 bg-[#40d6d1] hover:bg-[#13a19c] text-white font-medium rounded-full transition-all duration-300 group transform-gpu"
                >
                  Schedule Free Inspection
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none"
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </button>
                <a
                    href="tel:5022073007"
                    className="inline-flex items-center px-6 py-3 border border-[#40d6d1]/50 text-[#40d6d1] hover:bg-[#40d6d1] hover:text-white font-medium rounded-full transition-all duration-300 transform-gpu"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-1C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  Call (502) 207-3007
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="relative bg-[#0f1611] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div
                className="absolute top-0 left-1/3 w-96 h-96 bg-[#13938f]/10 rounded-full blur-[150px] animate-pulse-slow"/>
            <div
                className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-[120px] animate-pulse-slower"/>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {/* Company Info */}
              <motion.div
                  initial={{opacity: 0, y: 30}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true}}
                  transition={{duration: 0.7, ease: [0.25, 0.1, 0.25, 1]}}
                  className="lg:col-span-2"
              >
                <div className="mb-6">
                  <img
                      src="/onyx-roofing-logo-black.png"
                      alt="Onyx Roofing"
                      className="h-12 w-auto brightness-0 invert mb-4"
                  />
                  <p className="text-white/70 text-sm leading-relaxed max-w-md">
                    Your trusted roofing professionals serving Louisville and all of Kentucky.
                    We deliver premium craftsmanship with a commitment to excellence that protects
                    your most valuable investment.
                  </p>
                </div>
                <div className="space-y-3">
                  <motion.a
                      href="tel:5022073007"
                      className="flex items-center text-white/80 hover:text-[#40d6d1] transition-colors duration-300 group"
                      whileHover={{x: 3}}
                      transition={{duration: 0.2}}
                  >
                    <div
                        className="w-10 h-10 bg-[#40d6d1]/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-[#40d6d1]/20 transition-colors duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-1C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Call us anytime</p>
                      <p className="font-medium">(502) 207-3007</p>
                    </div>
                  </motion.a>
                  <motion.a
                      href="mailto:info@onyxroofingpro.com"
                      className="flex items-center text-white/80 hover:text-[#40d6d1] transition-colors duration-300 group"
                      whileHover={{x: 3}}
                      transition={{duration: 0.2}}
                  >
                    <div
                        className="w-10 h-10 bg-[#40d6d1]/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-[#40d6d1]/20 transition-colors duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Email us</p>
                      <p className="font-medium">info@onyxroofingpro.com</p>
                    </div>
                  </motion.a>
                </div>
              </motion.div>
              {/* Services */}
              <motion.div
                  initial={{opacity: 0, y: 30}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true}}
                  transition={{duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1]}}
              >
                <h3 className="text-lg font-medium text-white mb-4">Services</h3>
                <ul className="space-y-2">
                  {[
                    "Roof Replacement",
                    "Roof Repair",
                    "Storm Damage",
                    "Gutter Installation",
                    "Roof Inspection",
                    "Emergency Service"
                  ].map((service, index) => (
                      <motion.li
                          key={service}
                          initial={{opacity: 0, x: -20}}
                          whileInView={{opacity: 1, x: 0}}
                          viewport={{once: true}}
                          transition={{duration: 0.4, delay: 0.1 + index * 0.05, ease: [0.25, 0.1, 0.25, 1]}}
                      >
                        <a
                            href="#services" // Note: This anchor link will now point to a non-existent section
                            className="text-white/60 hover:text-[#40d6d1] transition-colors duration-300 text-sm block py-1 hover:translate-x-1 transform transition-transform"
                        >
                          {service}
                        </a>
                      </motion.li>
                  ))}
                </ul>
              </motion.div>
              {/* Company */}
              <motion.div
                  initial={{opacity: 0, y: 30}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true}}
                  transition={{duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1]}}
              >
                <h3 className="text-lg font-medium text-white mb-4">Company</h3>
                <ul className="space-y-2">
                  {[
                    {name: "About Us", href: "#about"},
                    {name: "Our Projects", href: "#portfolio"},
                    {name: "Service Areas", href: "#contact"},
                    {name: "Get Quote", href: "#", action: () => setIsFormOpen(true)},
                    {name: "Contact", href: "#contact"},
                    {name: "Reviews", href: "#"}
                  ].map((item, index) => (
                      <motion.li
                          key={item.name}
                          initial={{opacity: 0, x: -20}}
                          whileInView={{opacity: 1, x: 0}}
                          viewport={{once: true}}
                          transition={{duration: 0.4, delay: 0.2 + index * 0.05, ease: [0.25, 0.1, 0.25, 1]}}
                      >
                        {item.action ? (
                            <button
                                onClick={item.action}
                                className="text-white/60 hover:text-[#40d6d1] transition-colors duration-300 text-sm block py-1 hover:translate-x-1 transform transition-transform text-left"
                            >
                              {item.name}
                            </button>
                        ) : (
                            <a
                                href={item.href}
                                className="text-white/60 hover:text-[#40d6d1] transition-colors duration-300 text-sm block py-1 hover:translate-x-1 transform transition-transform"
                            >
                              {item.name}
                            </a>
                        )}
                      </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
            {/* Service Areas */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1]}}
                className="border-t border-white/10 pt-8 mb-8"
            >
              <h3 className="text-sm font-medium text-white/80 mb-3">Service Areas</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington",
                  "Hopkinsville", "Richmond", "Florence", "Georgetown", "Frankfort",
                  "Elizabethtown", "Henderson", "Jeffersontown", "Paducah"
                ].map((city, index) => (
                    <motion.span
                        key={city}
                        initial={{opacity: 0, scale: 0.8}}
                        whileInView={{opacity: 1, scale: 1}}
                        viewport={{once: true}}
                        transition={{duration: 0.4, delay: 0.3 + index * 0.02, ease: [0.25, 0.1, 0.25, 1]}}
                        className="px-3 py-1 bg-white/5 text-white/60 text-xs rounded-full border border-white/10 hover:bg-[#40d6d1]/10 hover:text-[#40d6d1] hover:border-[#40d6d1]/20 transition-all duration-300 cursor-default"
                    >
                      {city}
                    </motion.span>
                ))}
              </div>
            </motion.div>
            {/* Bottom Bar */}
            <motion.div
                initial={{opacity: 0}}
                whileInView={{opacity: 1}}
                viewport={{once: true}}
                transition={{duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0.25, 1]}}
                className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
            >
              <div
                  className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-white/50">
                <p>&copy; 2025 Onyx Roofing.</p>
              </div>
              {/* Credit Line */}
              <motion.div
                  initial={{opacity: 0}}
                  whileInView={{opacity: 1}}
                  viewport={{once: true}}
                  transition={{duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
                  className="text-center"
              >
                <p className="text-xs text-white/30">
                  Website developed by{" "}
                  <a
                      href="https://al-saba.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-[#40d6d1] transition-colors duration-300 underline"
                  >
                    Luqman Al-Saba
                  </a>
                </p>
              </motion.div>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-3">
                  {[
                    {
                      name: "Facebook",
                      link: "https://www.facebook.com/profile.php?id=61578690514178",
                      icon: (
                          <FaFacebook className="w-5 h-5" />
                      )
                    },
                    {
                      name: "Google",
                      link: "#",
                      icon: (
                          <FaGoogle className="w-5 h-5"/>
                      )
                    },
                    {
                      name: "Instagram",
                      link: "https://www.instagram.com/onyxroofingpro/",
                      icon: (
                          <FaInstagram className="w-5 h-5"/>
                      )
                    }
                  ].map((social) => (
                      <motion.a
                          key={social.name}
                          href={social.link}
                          target="_blank"
                          className="w-8 h-8 bg-white/5 hover:bg-[#40d6d1]/20 text-white/40 hover:text-[#40d6d1] rounded-lg flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-[#40d6d1]/30"
                          whileHover={{scale: 1.1, rotate: 5}}
                          whileTap={{scale: 0.95}}
                      >
                        {social.icon}
                      </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </footer>
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600&display=swap");
          * {
            box-sizing: border-box;
          }
          html, body {
            overflow-x: hidden;
            max-width: 100vw;
            width: 100%;
            overscroll-behavior-y: none; /* Prevent rubber-band scroll */
            margin: 0;
            padding: 0;
          }
          /* Add will-change hints for smooth animations */
          .transform-gpu {
            transform: translateZ(0);
            will-change: transform;
          }
          .h-dynamic {
            height: 100vh; /* Use standard viewport height for better mobile compatibility */
            min-height: 100vh;
          }
          @supports (height: 100dvh) {
            .h-dynamic {
              height: 100dvh; /* Dynamic viewport height for modern browsers */
            }
          }
          @keyframes pulse-slow {
            0%,
            100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.5;
            }
          }
          @keyframes pulse-slower {
            0%,
            100% {
              opacity: 0.2;
            }
            50% {
              opacity: 0.4;
            }
          }
          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }
          .animate-pulse-slower {
            animation: pulse-slower 5s ease-in-out infinite;
          }
          .font-inter {
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }
          @keyframes phone-wiggle {
            0%,
            100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(-5deg);
            }
            75% {
              transform: rotate(5deg);
            }
          }
          .wiggle-once {
            animation: phone-wiggle 0.5s ease-in-out;
          }
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin {
            animation: spin 0.8s linear infinite;
          }
          /* Mobile scroll fixes */
          @media (max-width: 768px) {
            html {
              overflow-x: hidden;
              overflow-y: auto;
            }
            body {
              overflow-x: hidden;
              overflow-y: auto;
              width: 100%;
              height: 100%;
            }
            * {
              max-width: 100vw;
            }
          }
          /* Hide horizontal scrollbar on all browsers */
          ::-webkit-scrollbar:horizontal {
            display: none;
          }
          html {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }
        `}</style>
      </div>
  );
}
