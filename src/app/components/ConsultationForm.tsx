"use client";

import React, {useEffect, useRef, useState} from "react";
import {motion, AnimatePresence, useAnimationControls, Variants, easeInOut} from "framer-motion";
import dynamic from "next/dynamic";
const AddressAutofill = dynamic(() => import("@mapbox/search-js-react").then(m => m.AddressAutofill), { ssr: false });

type MapboxRetrieveResponse = {
    features?: Array<{
        properties?: {
            full_address?: string;
            name?: string;
            place_name?: string;
        };
    }>;
};

type Props = {
    open: boolean;
    onClose: () => void;
    initialService?: string;
};

export default function ConsultationForm({ open, onClose, initialService }: Props) {
    const [isFormClosing, setIsFormClosing] = useState(false);
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

    // lock body scroll when open
    useEffect(() => {
        if (!open) return;
        const scrollY = window.scrollY;                   // preserve position
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";

        // prevent scroll chaining (iOS bounce → background scroll)
        document.documentElement.style.overscrollBehavior = "none";

        return () => {
            const top = document.body.style.top;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";
            document.documentElement.style.overscrollBehavior = "";
            window.scrollTo(0, top ? -parseInt(top, 10) : 0); // restore position
        };
    }, [open]);

    // Set initial service when form opens
    useEffect(() => {
        if (open && initialService) {
            setFormData((prev) => ({
                ...prev,
                services: [initialService],
            }));
        }
    }, [open, initialService]);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitStage, setSubmitStage] = useState<"idle" | "loading" | "success" | "complete">("idle");
    const [rippleOrigin, setRippleOrigin] = useState({ x: 0, y: 0 });

    const confettiRef = useRef<unknown>(null);
    const submitBtnRef = useRef<HTMLButtonElement>(null);

    // shake-on-error
    const fullNameControls = useAnimationControls();
    const phoneControls = useAnimationControls();
    const emailControls = useAnimationControls();
    const serviceAddressControls = useAnimationControls();

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "email") {
            const hasError = value.trim().length > 0 && !isValidEmail(value);
            setErrors((prev) => ({ ...prev, email: hasError }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: false as never }));
        }
    };

    const handleCheckboxChange = (service: string) => {
        setFormData((prev) => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter((s) => s !== service)
                : [...prev.services, service],
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

    const resetForm = () => {
        setFormStep(1);
        setIsSubmitted(false);
        setSubmitStage("idle");
        setErrors({ fullName: false, phone: false, email: false, serviceAddress: false });
        setFormData({
            fullName: "",
            phone: "",
            email: "",
            serviceAddress: "",
            services: [],
            message: "",
        });
        setShowDetails(false);
    };

    const handleCloseForm = () => {
        setIsFormClosing(true);
        setTimeout(() => {
            setIsFormClosing(false);
            resetForm();
            onClose();
        }, 500);
    };

    const handleNextStep = () => {
        const newErrors = {
            fullName: !formData.fullName.trim(),
            phone: !formData.phone.trim(),
            email: !formData.email.trim() || !isValidEmail(formData.email),
            serviceAddress: !formData.serviceAddress.trim(),
        };
        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            const wobble = {
                x: [0, -3, 3, -3, 3, -1.5, 1.5, 0],
                transition: { duration: 0.52, ease: easeInOut }
            };
            if (newErrors.fullName) {
                fullNameControls.start(wobble);
            }
            if (newErrors.phone) phoneControls.start(wobble);
            if (newErrors.email) emailControls.start(wobble);
            if (newErrors.serviceAddress) serviceAddressControls.start(wobble);
            return;
        }
        setFormStep(2);
    };

    const handlePreviousStep = () => {
        setFormStep(1);
        setErrors({ fullName: false, phone: false, email: false, serviceAddress: false });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStage("loading");
        if (submitBtnRef.current) {
            const rect = submitBtnRef.current.getBoundingClientRect();
            setRippleOrigin({ x: rect.width / 2, y: rect.height / 2 });
        }
        try {
            const res = await fetch("https://formspree.io/f/xdkdapno", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    phone: formData.phone,
                    email: formData.email,
                    serviceAddress: formData.serviceAddress,
                    services: formData.services.join(", "),
                    message: formData.message,
                    _subject: "New Consultation Request - Onyx Roofing",
                    _replyto: formData.email,
                    _format: "plain",
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to submit form");
            }
            setSubmitStage("success");
            await ejectConfetti();
            setTimeout(() => {
                setSubmitStage("complete");
                setIsSubmitted(true);
            }, 400);
        } catch (err) {
            console.error("Form submission error:", err);
            setSubmitStage("idle");
            alert("Sorry, there was an error submitting your request. Please try again or call us directly at 502-207-3007.");
        }
    };

    const handleViewRequests = () => {
        handleCloseForm();
    };

    const progressBarVariants: Variants = {
        hidden: { width: "0%" },
        visible: {
            width: isSubmitted ? "100%" : formStep === 2 ? "50%" : "0%",
            transition: { duration: 0.3, ease: "easeOut" },
        },
    };

    return (
        <AnimatePresence mode="wait">
            {open && (
                <motion.div
                    key="form-overlay"
                    className="fixed inset-0 z-50 pointer-events-auto bg-[#2a2d31] overflow-hidden"
                    initial={{ y: "100%", scale: 0.95, opacity: 0 }}
                    animate={{ y: isFormClosing ? "100%" : 0, scale: isFormClosing ? 0.95 : 1, opacity: isFormClosing ? 0 : 1 }}
                    exit={{ y: "100%", scale: 0.95, opacity: 0 }}
                    transition={{
                        y: { duration: 0.52, ease: [0.32, 0.72, 0, 1] },
                        scale: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
                        opacity: { duration: 0.4, ease: "easeOut" },
                    }}
                    style={{ borderRadius: "0 0 0 0", bottom: "env(safe-area-inset-bottom)", maxWidth: "100vw", height: "100dvh", overscrollBehavior: "contain" }}
                >
                    <motion.div
                        className="absolute inset-0 bg-[#2a2d31]/92 backdrop-blur-2xl"
                        initial={{ backdropFilter: "blur(0px)" }}
                        animate={{ backdropFilter: "blur(24px)" }}
                        transition={{ duration: 0.52, ease: "easeOut" }}
                    />
                    <motion.div
                        className="relative h-full flex items-center justify-center p-4 sm:p-8 mt-3 overflow-y-auto"
                        style={{ maxHeight: "100dvh", maxWidth: "100vw", WebkitOverflowScrolling: "touch" }}
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
                                                    <motion.div
                                                        key="step1"
                                                        initial={{ x: 50, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        exit={{ x: -50, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                                    >
                                                        <div className="space-y-4">
                                                            <motion.div animate={fullNameControls}>
                                                                <label className="block text-xs font-medium text-gray-300 mb-1">Name</label>
                                                                <input
                                                                    type="text"
                                                                    name="fullName"
                                                                    placeholder="Enter your full name"
                                                                    value={formData.fullName}
                                                                    onChange={handleInputChange}
                                                                    className={`w-full px-3 py-2 bg-[#3a3f45] border ${errors.fullName ? "border-red-500" : "border-[#4a4f55]"} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                                    aria-invalid={errors.fullName ? "true" : "false"}
                                                                />
                                                                <div className="h-1">{errors.fullName && <p className="text-xs text-red-400">Please enter your full name</p>}</div>
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
                                                                        className={`w-full px-3 py-2 bg-[#3a3f45] border ${errors.phone ? "border-red-500" : "border-[#4a4f55]"} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                                        aria-invalid={errors.phone ? "true" : "false"}
                                                                    />
                                                                    <div className="h-1">{errors.phone && <p className="text-xs text-red-400">Please enter your phone number</p>}</div>
                                                                </motion.div>

                                                                <motion.div animate={emailControls}>
                                                                    <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                                                                    <input
                                                                        type="email"
                                                                        name="email"
                                                                        placeholder="your@email.com"
                                                                        value={formData.email}
                                                                        onChange={handleInputChange}
                                                                        className={`w-full px-3 py-2 bg-[#3a3f45] border ${errors.email ? "border-red-500" : "border-[#4a4f55]"} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                                        aria-invalid={errors.email ? "true" : "false"}
                                                                    />
                                                                    <div className="h-1">
                                                                        {errors.email && <p className="text-xs text-red-400">{!formData.email ? "Please enter your email address" : "Please enter a valid email address"}</p>}
                                                                    </div>
                                                                </motion.div>
                                                            </div>


                                                            <motion.div animate={serviceAddressControls}>
                                                                <label className="block text-xs font-medium text-gray-300 mb-1">Service Address</label>
                                                                <AddressAutofill
                                                                    accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string}
                                                                    options={{
                                                                        country: 'US',
                                                                        limit: 3,
                                                                        // optional: bias toward Louisville
                                                                        // proximity: [-85.7585, 38.2527],
                                                                    }}
                                                                    onRetrieve={(res: MapboxRetrieveResponse) => {
                                                                        try {
                                                                            const feature = res.features?.[0];
                                                                            const props = feature && "properties" in feature ? (feature as { properties?: Record<string, unknown> }).properties : undefined;

                                                                            const full =
                                                                                (props?.["full_address"] as string | undefined) ??
                                                                                (props?.["name"] as string | undefined) ??
                                                                                (props?.["place_name"] as string | undefined);

                                                                            if (full) {
                                                                                setFormData((prev) => ({ ...prev, serviceAddress: full }));
                                                                            }
                                                                        } catch {
                                                                            // noop
                                                                        }
                                                                    }}
                                                                >
                                                                    <input
                                                                        type="text"
                                                                        name="serviceAddress"
                                                                        placeholder="Enter your address..."
                                                                        value={formData.serviceAddress}
                                                                        onChange={handleInputChange}
                                                                        autoComplete="address-line1"
                                                                        className={`w-full px-3 py-2 bg-[#3a3f45] border ${errors.serviceAddress ? "border-red-500" : "border-[#4a4f55]"} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                                        aria-invalid={errors.serviceAddress ? "true" : "false"}
                                                                    />
                                                                </AddressAutofill>
                                                                <div className="h-1">{errors.serviceAddress && <p className="text-xs text-red-400">Please enter a service address</p>}</div>
                                                            </motion.div>
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="step2"
                                                        initial={{ x: 50, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        exit={{ x: -50, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                                    >
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
                                                                                selected
                                                                                    ? "bg-[#5c9c5f]/50 text-[#fefefe] border-[#a1b5a1]/50"
                                                                                    : "bg-[#2d2f34] text-gray-300 border-[#4a4f55] hover:bg-[#383b40]"
                                                                            }`}
                                                                        >
                                                                            {service === "Roof Inspection" && (
                                                                                <span
                                                                                    className="absolute px-2 py-0 text-[11px] font-semibold bg-[#c78a36]/60 text-white/80"
                                                                                    style={{ borderRadius: "2px 2px 0 0", top: "-17px", right: "8px", boxShadow: "inset 0 -4px 8px -4px rgba(0,0,0,0.9)" }}
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
                                                    <button
                                                        onClick={handleNextStep}
                                                        className="flex-1 px-4 py-2 bg-[#13a19c] hover:bg-[#0f7a76] cursor-pointer text-white rounded-lg transition-all duration-200 font-medium text-sm"
                                                    >
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
                                                                    initial={{
                                                                        scale: 0,
                                                                        opacity: 1,
                                                                        borderRadius: "50%",
                                                                        width: 20,
                                                                        height: 20,
                                                                        left: rippleOrigin.x - 10,
                                                                        top: rippleOrigin.y - 10,
                                                                    }}
                                                                    animate={{ scale: 20, opacity: 0, transition: { duration: 0.52, ease: [0.4, 0.0, 0.2, 1] } }}
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
                                                                            <motion.svg key="checkmark" className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ pathLength: { duration: 0.3, ease: "easeInOut" }, opacity: { duration: 0.1 } }}>
                                                                                <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.2 } }}
                                            className="w-16 h-16 bg-[#13a19c]/20 rounded-full flex items-center justify-center mx-auto mb-4"
                                        >
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
    );
}
