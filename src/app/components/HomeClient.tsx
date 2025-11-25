"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import Hero from "@/app/components/Hero";
import ReviewCarousel from "@/app/components/reviews/ReviewCarousel";
import { ReviewItem } from "@/app/components/reviews/common";

// Dynamically import heavy components
const ServiceAreaMap = dynamic(() => import("@/app/components/ServiceAreaMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] md:h-[450px] bg-[#0f1410] rounded-2xl border border-white/5 animate-pulse" />
  ),
});

const ConsultationForm = dynamic(() => import("@/app/components/ConsultationForm"), {
  ssr: false,
});

interface HomeClientProps {
  initialVideo: string;
}

// Service mapping from homepage to form
const mapServiceToForm = (serviceTitle: string): string | undefined => {
  const mapping: Record<string, string> = {
    "Roof Replacement": "Complete Replacement",
    "Roof Repair": "Leak Repair",
    "Storm Damage": "Storm Damage",
    "Free Inspection": "Roof Inspection",
    "24/7 Emergency": "Emergency Service",
  };
  return mapping[serviceTitle];
};

export default function HomeClient({ initialVideo }: HomeClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormMounted, setIsFormMounted] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);

  const openForm = () => {
    setIsFormMounted(true);
    setIsFormOpen(true);
  };

  const handleServiceClick = (serviceTitle: string) => {
    const formService = mapServiceToForm(serviceTitle);
    setSelectedService(formService);
    openForm();
  };

  // --- Portfolio Items (Unchanged) ---
  const portfolioItems: ReviewItem[] = [
    {
      imageSrc: "/ibrahim-house.webp",
      title: "Residential Roof Repair",
      description: "Repaired damaged shingles and fixed leaking areas",
      reviewerName: "Luqman Al-Saba",
      rating: 5,
    },
    {
      imageSrc: "/lynley-house.webp",
      title: "Residential Roof Replacement",
      description:
        "Onyx Roofing did a fantastic job for one of my clients who had just purchased a home that needed a new roof. The transformation was major — the look, quality, and workmanship really elevated the entire property.\n\nIt gave my client peace of mind knowing the home was protected with a roof built to last.\n\nAs a real estate professional, it's great to have a trusted roofing company I can recommend without hesitation. Onyx Roofing exceeded expectations, and I'll gladly refer them again.",
      reviewerName: "Zach Fry, The Real Estate Guy!",
      rating: 5,
    },
  ];

  return (
    <div
      className="font-inter antialiased overflow-x-hidden"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* HERO */}
      <Hero
        isFormOpen={isFormOpen}
        onOpenForm={openForm}
        initialVideo={initialVideo}
      />

      {/* Consultation Form Overlay (lazy loaded) */}
      {isFormMounted && (
        <ConsultationForm
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedService(undefined);
          }}
          initialService={selectedService}
        />
      )}

      {/* Services Section */}
      <section
        id="services"
        className="relative py-12 sm:py-16 px-12 sm:px-8 bg-gradient-to-br from-[#1a1f1a] to-[#192119]"
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-40 right-0 w-40 h-40 bg-[#40d6d1]/8 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-50 h-50 bg-[#13938f]/10 rounded-full blur-[120px] animate-pulse-slower" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-2">
              Our <span className="font-normal text-[#40d6d1]">Services</span>
            </h2>
            <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto">
              Premium roofing solutions to protect your investment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                ),
                title: "Roof Replacement",
                description: "Complete replacement with premium materials",
                highlight: false,
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ),
                title: "Roof Repair",
                description: "Fix leaks and damaged shingles fast",
                highlight: false,
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                ),
                title: "Storm Damage",
                description: "Emergency storm damage restoration",
                highlight: false,
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
                title: "Free Inspection",
                description: "Comprehensive roof assessment at no cost",
                highlight: true,
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                ),
                title: "Gutter Services",
                description: "Installation and maintenance solutions",
                highlight: false,
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                title: "24/7 Emergency",
                description: "Round-the-clock urgent response",
                highlight: false,
              },
            ].map((service, index) => (
              <motion.button
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true, margin: "-50px" }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                onClick={() => handleServiceClick(service.title)}
                className={`
group relative rounded-lg overflow-hidden
bg-white/5 ring-1 ring-white/10
transform-gpu will-change-transform will-change-opacity
transition-transform transition-opacity transition-shadow transition-colors
duration-200 ease-out
hover:shadow-lg hover:bg-white/[0.07]
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
cursor-pointer text-left w-full
${service.highlight
                    ? "bg-gradient-to-br from-[#40d6d1]/20 to-[#13938f]/20 border border-[#40d6d1]/30 hover:border-[#40d6d1]/50"
                    : "bg-[#2a2d31]/30 backdrop-blur-sm border border-white/5 hover:border-[#40d6d1]/20 hover:bg-[#2a2d31]/50"
                  }`}
              >
                {service.highlight && (
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-[#40d6d1] text-[#192119] text-[10px] font-semibold rounded-bl-lg">
                    FREE
                  </div>
                )}
                <div className="p-5 flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-300 ${service.highlight
                        ? "bg-[#40d6d1]/20 group-hover:bg-[#40d6d1]/30"
                        : "bg-[#40d6d1]/10 group-hover:bg-[#40d6d1]/20"
                      }`}
                  >
                    <div className="text-[#40d6d1] group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-white mb-1 group-hover:text-[#40d6d1] transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800 ease-out pointer-events-none" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section
        id="portfolio"
        className="relative py-12 pb-18 px-4 sm:px-8 bg-gradient-to-br from-[#192119] to-[#192119]"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#40d6d1]/10 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-[#13938f]/15 rounded-full blur-[120px] animate-pulse-slower" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-4">
              View Our <span className="font-normal text-[#40d6d1]">Work</span>
            </h2>
            <p className="text-base text-white/70 max-w-xl mx-auto">
              Quality craftsmanship that speaks for itself
            </p>
          </motion.div>

          <ReviewCarousel items={portfolioItems} />

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mt-4"
          >
            <h3 className="text-xl text-white mb-4">Ready to Start Your Project?</h3>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              Proudly Kentucky-based roofers. Schedule your free inspection today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={openForm}
                className="shimmer-effect inline-flex items-center px-6 py-3 bg-[#13a19c] hover:bg-[#0f7a76] text-white font-medium rounded-full cursor-pointer transition-all duration-300 group transform-gpu"
              >
                Schedule Free Inspection
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <a
                href="tel:5022073007"
                className="shimmer-effect inline-flex items-center px-6 py-3 border border-[#40d6d1]/50 text-[#40d6d1] hover:bg-[#40d6d1] hover:text-white font-medium rounded-full transition-all duration-300 transform-gpu"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-1C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Call (502) 207-3007
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about"
        className="relative py-12 sm:py-16 px-4 sm:px-8 bg-gradient-to-br from-[#192119] to-[#1a1f1a]"
      >
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-2">
              About <span className="font-normal text-[#40d6d1]">Us</span>
            </h2>
            <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto">
              Your trusted partner in premium roofing solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 lg:gap-10 items-center">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="order-2 lg:order-1"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl sm:text-2xl font-semibold text-white mb-4">
                    Built on Trust, Delivered with Excellence
                  </h3>
                  <div className="space-y-4 text-xl text-white/80 leading-relaxed">
                    <p>
                      Onyx Roofing is a family-owned business serving Louisville and all of Kentucky. We've built our
                      reputation on exceptional craftsmanship, honest pricing, and unparalleled service.
                    </p>
                    <p>
                      We use only premium materials and employ skilled professionals who take pride in every project.
                      As your neighbors, we treat every home as if it were our own. Our 24/7 emergency service ensures
                      we're always here when you need us most.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  {[
                    { number: "100%", label: "Satisfaction" },
                    { number: "24/7", label: "Emergency" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                      className="text-center p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="text-3xl font-semibold text-[#40d6d1]" style={{ marginBottom: "0px" }}>
                        {stat.number}
                      </div>
                      <div className="text-md text-white/60">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Owner Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative order-1 lg:order-2 mb-6 lg:mb-0 flex items-center justify-center"
            >
              <div
                style={{ zIndex: 1 }}
                className="relative rounded-md overflow-hidden bg-[#2a2d31]/50 backdrop-blur-sm border border-white/10 w-full max-w-[500px] lg:max-w-[500px]"
              >
                <div className="relative aspect-[5/4]" style={{ zIndex: 1 }}>
                  <Image
                    src="/ibrahim-maddie.webp"
                    alt="Ibrahim Al-Saba, Founder of Onyx Roofing"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>

                <div className="p-4 sm:p-5 sm:py-3 bg-gradient-to-t from-[#36363699] to-[#36363699]" style={{ zIndex: 10 }}>
                  {/* Mobile */}
                  <div className="flex flex-col sm:hidden gap-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-white">Ibrahim Al-Saba</h3>
                      <p className="text-white/70 text-sm">Owner, Onyx Roofing</p>
                    </div>
                    <a
                      href="tel:5022073007"
                      style={{ borderRadius: "10px" }}
                      className="shimmer-effect w-full flex items-center justify-center gap-2 border border-white/15 bg-[#549956]/56 px-4 py-2 text-md text-white hover:bg-[#40d6d1] hover:text-[#192119] hover:border-[#40d6d1]/50 transition-colors"
                      aria-label="Call Ibrahim at (502) 207-3007"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-1C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span className="whitespace-nowrap" style={{ fontSize: "16px" }}>
                        (502) 207-3007
                      </span>
                    </a>
                  </div>

                  {/* Desktop/Tablet */}
                  <div className="hidden sm:flex items-center justify-between w-full gap-3">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">Ibrahim Al-Saba</h3>
                      <p className="text-white/70 text-md">Owner, Onyx Roofing</p>
                    </div>
                    <a
                      href="tel:5022073007"
                      style={{ borderRadius: "10px" }}
                      className="shimmer-effect shrink-0 inline-flex items-center gap-2 border border-white/15 bg-[#549956]/56 px-4 py-2 text-md text-white hover:bg-[#40d6d1] hover:text-[#192119] hover:border-[#40d6d1]/50 transition-colors"
                      aria-label="Call Ibrahim at (502) 207-3007"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-1C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span className="whitespace-nowrap" style={{ fontSize: "18px" }}>
                        (502) 207-3007
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div
                className="absolute -top-4 -right-4 w-20 h-20 bg-[#40d6d1]/10 rounded-full blur-xl hidden lg:block"
                style={{ zIndex: -1 }}
              />
              <div
                className="absolute -bottom-0 -left-0 w-16 h-16 bg-[#13938f]/10 rounded-full blur-xl hidden lg:block"
                style={{ zIndex: -1 }}
              />
            </motion.div>
          </div>

          {/* Certifications/Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-center"
            style={{ marginTop: "2.5rem" }}
          >
            <div className="inline-flex flex-wrap gap-3 items-center justify-center">
              {["Licensed & Insured", "BBB Accredited", "GAF Certified", "5-Star Rated"].map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#40d6d1]/10 rounded-full border border-[#40d6d1]/20"
                >
                  <svg className="w-5 h-5 text-[#40d6d1]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-md text-white/80">{badge}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <section
          id="coverage"
          className="relative py-16 px-6 sm:px-12 bg-gradient-to-br from-[#1a1f1a] to-[#1a1f1a]"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-10">
              Our <span className="font-normal text-[#40d6d1]">Coverage Area</span>
            </h2>

            {/* Map */}
            <div className="rounded-2xl shadow-lg w-full mx-auto mb-8">
              <ServiceAreaMap />
            </div>

            {/* Text + Call Button */}
            <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto mb-6">
              Not seeing your city? <br /> We frequently travel for storm and insurance work—reach out.
            </p>
            <a
              href="tel:5022073007"
              className="shimmer-effect inline-block border border-[#40d6d1]/40 text-white rounded-lg px-6 py-3 hover:bg-[#40d6d1]/10 transition"
            >
              Call 502-207-3007
            </a>
          </div>
        </section>
      </motion.div>

      {/* Footer Section */}
      <footer id="contact" className="relative bg-[#0f1611] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#13938f]/10 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-[120px] animate-pulse-slower" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="lg:col-span-2"
            >
              <div className="mb-6">
                <Image
                  src="/onyx-roofing-logo-black.webp"
                  alt="Onyx Roofing"
                  width={120}
                  height={48}
                  className="h-12 w-auto mb-4 invert brightness-0 invert"
                />
                <p className="text-white/70 text-sm leading-relaxed max-w-md">
                  Your trusted roofing professionals serving Louisville and all of Kentucky. We deliver premium
                  craftsmanship with a commitment to excellence that protects your most valuable investment.
                </p>
              </div>
              <div className="space-y-3">
                <motion.a
                  href="tel:5022073007"
                  className="flex items-center text-white/80 hover:text-[#40d6d1] transition-colors duration-300 group"
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-10 h-10 bg-[#40d6d1]/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-[#40d6d1]/20 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-1C7.82 18 2 12.18 2 5V3z" />
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
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-10 h-10 bg-[#40d6d1]/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-[#40d6d1]/20 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h3 className="text-lg font-medium text-white mb-4">Services</h3>
              <ul className="space-y-2">
                {[
                  "Roof Replacement",
                  "Roof Repair",
                  "Storm Damage",
                  "Gutter Installation",
                  "Roof Inspection",
                  "Emergency Service",
                ].map((service, index) => (
                  <motion.li
                    key={service}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <a
                      href="#services"
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h3 className="text-lg font-medium text-white mb-4">Company</h3>
              <ul className="space-y-2">
                {[
                  { name: "About Us", href: "#about" },
                  { name: "Our Projects", href: "#portfolio" },
                  { name: "Service Areas", href: "#contact" },
                  { name: "Get Quote", href: "#", action: openForm },
                  { name: "Contact", href: "#contact" },
                  { name: "Reviews", href: "#" },
                ].map((item, index) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="border-t border-white/10 pt-8 mb-8"
          >
            <h3 className="text-sm font-medium text-white/80 mb-3">Service Areas</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Louisville",
                "Lexington",
                "Bowling Green",
                "Owensboro",
                "Covington",
                "Hopkinsville",
                "Richmond",
                "Florence",
                "Georgetown",
                "Frankfort",
                "Elizabethtown",
                "Henderson",
                "Jeffersontown",
                "Paducah",
              ].map((city, index) => (
                <motion.span
                  key={city}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.02, ease: [0.25, 0.1, 0.25, 1] }}
                  className="px-3 py-1 bg-white/5 text-white/60 text-xs rounded-full border border-white/10 hover:bg-[#40d6d1]/10 hover:text-[#40d6d1] hover:border-[#40d6d1]/20 transition-all duration-300 cursor-default"
                >
                  {city}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          >
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-white/50">
              <p>&copy; 2025 Onyx Roofing.</p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
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
              <div className="flex gap-5 text-2xl">
                {[
                  {
                    name: "Facebook",
                    icon: "facebook-f",
                    href: "https://www.facebook.com/OnyxRoofing/",
                  },
                  {
                    name: "Instagram",
                    icon: "instagram",
                    href: "https://www.instagram.com/OnyxRoofingPro",
                  },
                  { name: "Threads", icon: "threads", href: "https://www.threads.net/@OnyxRoofingPro" },
                  { name: "Twitter", icon: "x-twitter", href: "https://x.com/OnyxRoofingPro" },
                  { name: "YouTube", icon: "youtube", href: "https://www.youtube.com/@OnyxRoofingPro" },
                  {
                    name: "LinkedIn",
                    icon: "linkedin-in",
                    href: "https://www.linkedin.com/in/onyx-roofing-331b3b383/",
                  },
                ].map(({ name, icon, href }) => (
                  <motion.a
                    key={name}
                    href={href}
                    aria-label={name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/5 hover:bg-[#40d6d1]/20 text-white/40 hover:text-[#40d6d1] rounded-lg flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-[#40d6d1]/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 1 }}
                  >
                    <i className={`fab fa-${icon}`}></i>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      <style jsx>{`
/* Marquee */
@keyframes marquee {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}

.marquee-track {
    width: 200%;
    animation: marquee linear infinite;
}

.marquee-paused:hover .marquee-track {
    animation-play-state: paused;
}

/* Small utilities */
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
`}</style>
    </div>
  );
}
