"use client";
import { motion, AnimatePresence, useAnimationControls, Variants } from "framer-motion";
import React, { useState, useEffect, useRef, useCallback } from "react";

// Type declarations for Google Maps API
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: {
              types?: string[];
              componentRestrictions?: { country: string };
              fields?: string[];
            }
          ) => {
            addListener: (event: string, callback: () => void) => void;
            getPlace: () => {
              formatted_address?: string;
            };
          };
        };
      };
    };
  }
}

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormClosing, setIsFormClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("/alsaba-house-afternoon.mp4");
  const [nextVideo, setNextVideo] = useState<string | null>(null);
  const [videoQueue, setVideoQueue] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [googleMapsError, setGoogleMapsError] = useState<string | null>(null);
  const [submitStage, setSubmitStage] = useState<"idle" | "loading" | "success" | "complete">("idle");
  const [rippleOrigin, setRippleOrigin] = useState({ x: 0, y: 0 });

  const confettiRef = useRef<unknown>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const phoneIconRef = useRef<SVGSVGElement>(null);
  const fullNameControls = useAnimationControls();
  const phoneControls = useAnimationControls();
  const emailControls = useAnimationControls();
  const serviceAddressControls = useAnimationControls();

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

  // Video selection based on weather and time
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

  // Preload next video
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

  // Transition to next video
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

  // Handle scroll detection
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse movement for parallax effect
  useEffect(() => {
    let targetX = 0,
      targetY = 0,
      currentX = 0,
      currentY = 0;
    let animationId: number;
    const lerpFactor = 0.08;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetX = (clientX - centerX) / centerX;
      targetY = (clientY - centerY) / centerY;
    };

    const animate = () => {
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        setMousePosition({ x: currentX, y: currentY });
      }

      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (typeof window !== "undefined" && window.google) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB1p6Tyk3pWW05XVsEbfHhWXUy1G-GDxms&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGoogleMapsLoaded(true);
        setGoogleMapsError(null);
      };
      script.onerror = () => {
        setGoogleMapsError("Failed to load address autocomplete. Please enter the address manually.");
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  // Initialize Google Maps Autocomplete
  useEffect(() => {
    if (isFormOpen && isGoogleMapsLoaded && autocompleteRef.current && typeof window !== "undefined" && window.google) {
      try {
        const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
          types: ["address"],
          componentRestrictions: { country: "us" },
          fields: ["formatted_address"],
        });
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            setFormData((prev) => ({ ...prev, serviceAddress: place.formatted_address || "" }));
            setErrors((prev) => ({ ...prev, serviceAddress: false }));
          }
        });
      } catch (error) {
        setGoogleMapsError("Address autocomplete is unavailable. Please enter the address manually. " + error);
      }
    }
  }, [isFormOpen, isGoogleMapsLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleCheckboxChange = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service) ? prev.services.filter((s) => s !== service) : [...prev.services, service],
    }));
  };

  const ejectConfetti = async () => {
    if (!confettiRef.current) {
      const { default: load } = await import("canvas-confetti");
      confettiRef.current = load;
    }
    const confetti = confettiRef.current as { (options: unknown): void };
    const btn = submitBtnRef.current;
    let origin = { x: 0.5, y: 0.6 };
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
      setErrors({ fullName: false, phone: false, email: false, serviceAddress: false });
    }, 500);
  };

  const handleNextStep = async () => {
    const newErrors = {
      fullName: !formData.fullName,
      phone: !formData.phone,
      email: !formData.email,
      serviceAddress: !formData.serviceAddress,
    };

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      if (newErrors.fullName)
        fullNameControls.start({
          x: [0, -3, 3, -3, 3, -1.5, 1.5, 0],
          transition: { duration: 0.6, times: [0, 0.15, 0.3, 0.45, 0.55, 0.7, 0.85, 1], ease: "easeInOut" },
        });
      if (newErrors.phone)
        phoneControls.start({
          x: [0, -3, 3, -3, 3, -1.5, 1.5, 0],
          transition: { duration: 0.6, times: [0, 0.15, 0.3, 0.45, 0.55, 0.7, 0.85, 1], ease: "easeInOut" },
        });
      if (newErrors.email)
        emailControls.start({
          x: [0, -3, 3, -3, 3, -1.5, 1.5, 0],
          transition: { duration: 0.6, times: [0, 0.15, 0.3, 0.45, 0.55, 0.7, 0.85, 1], ease: "easeInOut" },
        });
      if (newErrors.serviceAddress)
        serviceAddressControls.start({
          x: [0, -3, 3, -3, 3, -1.5, 1.5, 0],
          transition: { duration: 0.6, times: [0, 0.15, 0.3, 0.45, 0.55, 0.7, 0.85, 1], ease: "easeInOut" },
        });
      return;
    }

    setFormStep(2);
  };

  const handlePreviousStep = () => {
    setFormStep(1);
    setErrors({ fullName: false, phone: false, email: false, serviceAddress: false });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!formData.fullName || !formData.phone || !formData.email || !formData.serviceAddress || formData.services.length === 0) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setRippleOrigin({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setSubmitStage("loading");

    setTimeout(async () => {
      setSubmitStage("success");
      await ejectConfetti();

      setTimeout(() => {
        setSubmitStage("complete");
        setIsSubmitted(true);
      }, 400);
    }, 800);
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
    hidden: { width: "0%" },
    visible: {
      width: isSubmitted ? "100%" : formStep === 2 ? "50%" : "0%",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="font-inter antialiased overflow-x-hidden" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <main
        className="h-dynamic text-white relative overflow-hidden"
        style={{
          border: isMobile ? "8px solid #192119" : "16px solid #192119",
          background: "#192119",
          borderRadius: "0px",
          maxWidth: "100vw",
          touchAction: "none", // Prevent unwanted touch gestures
        }}
      >
        <div className="relative h-full overflow-hidden" style={{ borderRadius: "32px 32px 0 0", maxWidth: "100%" }}>
          <canvas id="confetti-canvas" className="absolute inset-0 pointer-events-none" style={{ zIndex: 100 }} />
          <motion.div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: "#192119" }} animate={{ scale: scrolled ? 1.02 : 1 }} transition={{ duration: 0.6, ease: "easeOut" }}>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: isTransitioning ? 0 : 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={currentVideo} type="video/mp4" />
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
              initial={{ opacity: 0 }}
              animate={{ opacity: isTransitioning ? 1 : 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={nextVideo || currentVideo} type="video/mp4" />
            </motion.video>
            <div className="hidden md:block absolute top-1/3 left-1/4 w-96 h-96 bg-[#13938f]/3 rounded-full blur-[120px] animate-pulse-slow will-change-[opacity]" />
            <div className="hidden md:block absolute bottom-1/3 right-1/3 w-96 h-96 bg-white/3 rounded-full blur-[100px] animate-pulse-slower will-change-[opacity]" />
          </motion.div>
          <div className="relative z-20 h-full pb-16 md:pb-0">
            <section className="relative h-full flex items-center justify-center px-4 sm:px-8">
              <AnimatePresence mode="wait">
                {!isFormOpen ? (
                  <motion.div
                    key="hero-content"
                    className="relative z-20 text-left mx-auto px-4 max-w-md sm:max-w-lg md:max-w-4xl pt-8 w-full"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight" style={{ textAlign: "left", textShadow: "-0px 0px 3px rgba(0,0,0, .32)" }}>
                        <span className="block text-white mb-1 sm:mb-3 tracking-wide" style={{ mixBlendMode: "difference" }}>
                          Built to <span className="font-normal" style={{ mixBlendMode: "difference", color: "#40d6d1" }}>Withstand.</span>
                        </span>
                        <span className="block text-white tracking-wide" style={{ mixBlendMode: "difference" }}>
                          Designed to <span className="font-normal" style={{ mixBlendMode: "difference", color: "#40d6d1" }}>Impress.</span>
                        </span>
                      </h1>
                    </motion.div>
                    <motion.p
                      className="mt-6 sm:mt-10 text-sm sm:text-base md:text-lg text-white/80 max-w-md sm:max-w-lg md:max-w-2xl leading-relaxed font-light"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                    >
                      Your trusted roofing professionals serving Louisville and all of Kentucky.
                      <span className="block mt-1">Premium craftsmanship for discerning homeowners.</span>
                    </motion.p>
                    <motion.div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-start items-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}>
                      <button
                        onClick={() => setIsFormOpen(true)}
                        className="group relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-[#13a19c] hover:bg-[#0f7a76] text-white font-normal rounded-full transition-all duration-300 flex items-center cursor-pointer text-sm sm:text-base"
                      >
                        <span className="mr-3">Schedule Free Inspection</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                      <a href="#portfolio" className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 border border-white/50 text-white hover:bg-white hover:text-gray-900 font-normal rounded-full transition-all duration-300 cursor-pointer text-sm sm:text-base" style={{ backdropFilter: "blur(20px)" }}>
                        View Our Work
                      </a>
                    </motion.div>
                    <motion.div className="mt-8 sm:mt-16 grid grid-cols-2 sm:flex sm:flex-wrap justify-start items-stretch gap-2 sm:gap-3 text-xs sm:text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
                      {["Licensed & Insured", "Free Inspection", "Kentucky Owned", "Family Business"].map((item, index) => (
                        <motion.span
                          key={item}
                          className="inline-flex items-center gap-2 text-white/90 font-light px-2 sm:px-3 py-1 sm:py-2 bg-[#474747]/30 backdrop-blur-md h-full"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                          style={{ borderRadius: "16px", border: "2px solid rgba(200,200,200,0.04)" }}
                        >
                          <span className="text-sm">✓</span>
                          <span>{item}</span>
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {isFormOpen && (
                      <motion.div
                        key="form-overlay"
                        className="fixed inset-0 z-25 pointer-events-auto bg-[#2a2d31] overflow-hidden"
                        initial={{ y: "100%", scale: 0.95, opacity: 0 }}
                        animate={{
                          y: isFormClosing ? "100%" : 0,
                          scale: isFormClosing ? 0.95 : 1,
                          opacity: isFormClosing ? 0 : 1,
                        }}
                        exit={{ y: "100%", scale: 0.95, opacity: 0 }}
                        transition={{
                          y: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
                          scale: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
                          opacity: { duration: 0.4, ease: "easeOut" },
                        }}
                        style={{ borderRadius: "32px 32px 0 0", bottom: "env(safe-area-inset-bottom)", maxWidth: "100vw", height: "100dvh" }}
                      >
                        <motion.div className="absolute inset-0 bg-[#2a2d31]/92 backdrop-blur-2xl" initial={{ backdropFilter: "blur(0px)" }} animate={{ backdropFilter: "blur(24px)" }} transition={{ duration: 0.6, ease: "easeOut" }} />
                        <motion.div
                          className="relative h-full flex items-center justify-center p-4 sm:p-8 mt-3 overflow-y-auto"
                          style={{ maxHeight: "100dvh", maxWidth: "100vw" }}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                        >
                          <motion.div className="w-full max-w-lg mx-auto">
                            <AnimatePresence mode="wait">
                              {submitStage !== "complete" ? (
                                <motion.div key="form-content" className="relative" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                                  <motion.div className="mb-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
                                    <h2 className="text-xl sm:text-2xl font-semibold text-white mb-1">Schedule Your Consultation</h2>
                                    <p className="text-xs sm:text-sm text-gray-400">
                                      Step {formStep} of 2: {formStep === 1 ? "Your Information" : "Services & Details"}
                                    </p>
                                  </motion.div>
                                  <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
                                    <motion.div className="w-full bg-[#3a3f45] rounded-full h-1 mb-5" initial="hidden" animate="visible">
                                      <motion.div className="h-1 bg-[#13a19c] rounded-full" variants={progressBarVariants} initial="hidden" animate="visible" />
                                    </motion.div>
                                    <AnimatePresence mode="wait">
                                      {formStep === 1 ? (
                                        <motion.div key="step1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
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
                                              <div className="h-1">{errors.fullName && <p id="fullName-error" className="text-xs text-red-400">Please enter your full name</p>}</div>
                                            </motion.div>
                                            <div className="grid grid-cols-2 gap-3">
                                              <motion.div animate={phoneControls}>
                                                <label className="block text-xs font-medium text-gray-300 mb-1">Phone Number</label>
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
                                                <div className="h-1">{errors.phone && <p id="phone-error" className="text-xs text-red-400">Please enter your phone number</p>}</div>
                                              </motion.div>
                                              <motion.div animate={emailControls}>
                                                <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
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
                                                <div className="h-1">{errors.email && <p id="email-error" className="text-xs text-red-400">Please enter your email address</p>}</div>
                                              </motion.div>
                                            </div>
                                            <motion.div animate={serviceAddressControls}>
                                              <label className="block text-xs font-medium text-gray-300 mb-1">Service Address</label>
                                              <div style={{ position: "relative", overflow: "visible" }}>
                                                <input
                                                  ref={autocompleteRef}
                                                  type="text"
                                                  name="serviceAddress"
                                                  placeholder="Start typing to search addresses..."
                                                  value={formData.serviceAddress}
                                                  onChange={handleInputChange}
                                                  className={`w-full px-3 py-2 bg-[#3a3f45] border ${errors.serviceAddress ? "border-red-500" : "border-[#4a4f55]"} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                                  aria-invalid={errors.serviceAddress ? "true" : "false"}
                                                  aria-describedby={errors.serviceAddress ? "serviceAddress-error" : undefined}
                                                />
                                                <div className="h-1">
                                                  {errors.serviceAddress && <p id="serviceAddress-error" className="text-xs text-red-400">Please enter a service address</p>}
                                                  {googleMapsError && <p className="text-xs text-red-400">{googleMapsError}</p>}
                                                </div>
                                              </div>
                                            </motion.div>
                                          </div>
                                        </motion.div>
                                      ) : (
                                        <motion.div key="step2" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                                          <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-4">Services Needed</label>
                                            <motion.div layout className="grid grid-cols-2 gap-2" style={{ textAlign: "left" }}>
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
                                                        style={{ boxShadow: "inset 0 -4px 8px -4px rgba(0, 0, 0, 0.9)", fontSize: "11px", borderRadius: "2px 2px 0 0", top: "-17px", right: "8px" }}
                                                      >
                                                        Popular
                                                      </span>
                                                    )}
                                                    <span>{service}</span>
                                                    <AnimatePresence initial={false} mode="wait">
                                                      {selected && (
                                                        <motion.span
                                                          key="check"
                                                          initial={{ scale: 0.5, opacity: 0, rotate: -64 }}
                                                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                          exit={{ scale: 0.5, opacity: 0, rotate: 32 }}
                                                          transition={{ duration: 0.25, ease: "easeOut" }}
                                                          className="ml-2 w-5 h-5 flex items-center justify-center rounded-full bg-[#3f8c42]"
                                                        >
                                                          <svg className="w-3 h-3 text-[#fefefe]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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
                                              <motion.svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" animate={{ rotate: showDetails ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                              </motion.svg>
                                            </motion.button>
                                            <AnimatePresence initial={false}>
                                              {showDetails && (
                                                <motion.div
                                                  key="details-content"
                                                  layout
                                                  initial={{ opacity: 0, height: 0 }}
                                                  animate={{ opacity: 1, height: "auto" }}
                                                  exit={{ opacity: 0, height: 0 }}
                                                  transition={{ duration: 0.3, ease: "easeInOut" }}
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
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        {formStep === 1 ? "Back" : "Previous"}
                                      </button>
                                      {formStep === 1 ? (
                                        <button onClick={handleNextStep} className="flex-1 px-4 py-2 bg-[#13a19c] hover:bg-[#0f7a76] cursor-pointer text-white rounded-lg transition-all duration-200 font-medium text-sm">
                                          Next
                                        </button>
                                      ) : (
                                        <motion.button
                                          ref={submitBtnRef}
                                          onClick={handleSubmit}
                                          disabled={submitStage !== "idle"}
                                          className="flex-1 relative px-4 py-2 bg-[#13a19c] hover:bg-[#0f7a76] disabled:hover:bg-[#13a19c] cursor-pointer disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 font-medium text-sm overflow-hidden"
                                          whileTap={submitStage === "idle" ? { scale: 0.97 } : {}}
                                        >
                                          <AnimatePresence>
                                            {submitStage !== "idle" && (
                                              <motion.span
                                                className="absolute inset-0 bg-white/20"
                                                initial={{ scale: 0, opacity: 1, borderRadius: "50%", width: "20px", height: "20px", left: rippleOrigin.x - 10, top: rippleOrigin.y - 10 }}
                                                animate={{ scale: 20, opacity: 0, transition: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1] } }}
                                                exit={{ opacity: 0 }}
                                              />
                                            )}
                                          </AnimatePresence>
                                          <AnimatePresence mode="wait">
                                            {submitStage === "idle" && (
                                              <motion.span key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }} className="relative z-10">
                                                Submit Request
                                              </motion.span>
                                            )}
                                            {(submitStage === "loading" || submitStage === "success") && (
                                              <motion.div key="loading" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="absolute inset-0 flex items-center justify-center">
                                                <AnimatePresence mode="wait">
                                                  {submitStage === "loading" && <motion.div key="spinner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                                  {submitStage === "success" && (
                                                    <motion.svg
                                                      key="checkmark"
                                                      className="w-4 h-4 text-white"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      viewBox="0 0 24 24"
                                                      initial={{ pathLength: 0, opacity: 0 }}
                                                      animate={{ pathLength: 1, opacity: 1 }}
                                                      transition={{ pathLength: { duration: 0.3, ease: "easeInOut" }, opacity: { duration: 0.1 } }}
                                                    >
                                                      <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} />
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
                                <motion.div
                                  key="success-content"
                                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                  animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25, delay: 0.1 } }}
                                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                  className="text-center"
                                  aria-live="polite"
                                >
                                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.2 } }} className="w-16 h-16 bg-[#13a19c]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-[#13a19c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </motion.div>
                                  <motion.h3 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.3, delay: 0.3 } }} className="text-xl sm:text-2xl font-semibold text-white mb-2">
                                    Request Booked!
                                  </motion.h3>
                                  <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.3, delay: 0.4 } }} className="text-gray-400 mb-6 text-sm sm:text-base">
                                    We'll be in touch shortly to confirm your consultation details.
                                  </motion.p>
                                  <motion.button
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25, delay: 0.5 } }}
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
                )}
              </AnimatePresence>
            </section>
            <motion.nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? "py-4" : "py-6 md:py-10"}`} style={{ background: "transparent" }} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
              <div className="max-w-7xl mx-auto px-12 pt-3 sm:px-8 flex items-center justify-between">
                <motion.img src="/onyx-roofing-logo-black.png" alt="Onyx Roofing" className="h-10 sm:h-13 w-auto brightness-0 invert" whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }} />
                <div className="hidden md:flex items-center gap-8">
                  {["Services", "Projects", "About", "Contact"].map((item, index) => (
                    <motion.a key={item} href={`#${item.toLowerCase()}`} className="text-white/80 hover:text-white text-md font-normal transition-all duration-300" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index, duration: 0.5 }}>
                      {item}
                    </motion.a>
                  ))}
                </div>
                <div className="md:hidden">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
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
                    transition={{
                      y: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
                      scale: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
                      opacity: { duration: 0.4, ease: "easeOut" },
                    }}
                  >
                    <div className="h-full flex flex-col items-center justify-center space-y-6 px-6">
                      {["Services", "Projects", "About", "Contact"].map((item, i) => (
                        <motion.a key={item} href={`#${item.toLowerCase()}`} className="text-white text-2xl font-medium" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }} onClick={() => setIsMenuOpen(false)}>
                          {item}
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.nav>
          </div>
        </div>
        <a
          href="tel:5022073007"
          className="fixed bottom-0 inset-x-0 bg-[#192119] text-white text-center py-4 z-20 flex items-center justify-center"
          style={{
            borderRadius: "0",
            background: "#192119",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            maxWidth: "100vw"
          }}
        >
          <svg ref={phoneIconRef} className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-1C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <span className="font-semibold text-lg sm:text-xl" style={{ backgroundColor: "#192119" }}>
            Call us at 502-207-3007
          </span>
        </a>
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
            position: fixed; /* Lock body to prevent scrolling */
            height: 100%;
            margin: 0;
            padding: 0;
          }

          .h-dynamic {
            height: 100dvh; /* Dynamic viewport height */
          }
          @supports not (height: 100dvh) {
            .h-dynamic {
              height: -webkit-fill-available; /* Fallback for older iOS */
            }
          }
          @supports not (height: -webkit-fill-available) {
            .h-dynamic {
              height: calc(var(--vh, 1vh) * 100); /* JS fallback */
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

          .pac-container {
            z-index: 10000 !important;
            background-color: #3a3f45;
            border: 1px solid #4a4f55;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            color: #ffffff;
            font-family: "Inter", sans-serif;
            margin-top: 4px;
            width: 100% !important;
            max-width: 400px;
            max-height: 50dvh; /* Limit height on mobile */
            overflow-y: auto; /* Allow scrolling within dropdown */
            display: block !important;
            visibility: visible !important;
          }

          .pac-item {
            padding: 8px 12px;
            color: #ffffff;
            font-size: 14px;
            cursor: pointer;
            line-height: 1.5;
          }

          .pac-item:hover {
            background-color: #4a4f55;
          }

          .pac-item-query {
            color: #ffffff;
            font-weight: 500;
          }

          .pac-matched {
            color: #13a19c;
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
            }

            body {
              overflow-x: hidden;
              position: fixed;
              width: 100%;
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
      </main>
    </div>
  );
}