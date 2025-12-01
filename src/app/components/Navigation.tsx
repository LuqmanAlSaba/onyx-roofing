"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Hamburger from "./Hamburger";

interface NavigationProps {
  variant?: "hero" | "fixed";
}

export default function Navigation({ variant = "fixed" }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const idMap: Record<string, string> = {
    services: "services",
    projects: "portfolio",
    about: "about",
    contact: "contact",
    coverage: "coverage",
    blog: "blog"
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    // Blog navigation uses regular navigation
    if (targetId === 'blog') {
      if (isMenuOpen) setIsMenuOpen(false);
      return;
    }

    // If we are on the home page, scroll smoothly
    if (pathname === '/') {
      e.preventDefault();
      const id = idMap[targetId] || targetId;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        if (isMenuOpen) setIsMenuOpen(false);
      }
    } else {
      // If not on home page, allow default navigation (which will go to /#id)
      if (isMenuOpen) setIsMenuOpen(false);
    }
  };

  const navClasses = variant === "hero"
    ? "absolute top-0 left-0 right-0 z-40 py-6 md:py-10"
    : "sticky top-0 left-0 right-0 z-40 py-6 md:py-10 bg-[#192119]/95 backdrop-blur-md";

  return (
    <motion.nav
      className={navClasses}
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="max-w-7xl mx-auto px-12 pt-0 sm:px-8 flex items-center justify-between">
        <motion.div
          className="h-10 sm:h-13 w-auto z-100 relative"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <Link href="/">
            <Image
              src="/onyx-roofing-logo.svg"
              alt="Onyx Roofing"
              width={120}
              height={40}
              className="h-10 sm:h-13 w-auto invert brightness-0 invert"
              priority
            />
          </Link>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          {["Services", "Projects", "About", "Coverage", "Contact", "Blog"].map((item, index) => {
            const targetId = item.toLowerCase();
            const sectionId = idMap[targetId] || targetId;
            const href = targetId === 'blog' ? '/blog' : `/#${sectionId}`;
            const isBlog = item === "Blog";

            return (
              <motion.a
                key={item}
                href={href}
                onClick={(e) => handleNavClick(e, targetId)}
                className={
                  isBlog
                    ? "px-5 py-2 bg-[#13a19c]/90 backdrop-blur-sm border border-[#40d6d1]/50 text-white hover:bg-[#13a19c] hover:border-[#40d6d1] text-md font-semibold rounded-full shadow-[0_0_15px_rgba(19,161,156,0.4)] hover:shadow-[0_0_20px_rgba(19,161,156,0.6)] transition-all duration-300"
                    : "text-white/100 hover:text-white text-md font-normal transition-all duration-300"
                }
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={isBlog ? { scale: 1.05 } : {}}
              >
                {item}
              </motion.a>
            );
          })}
        </div>

        <div className="md:hidden z-100">
          <Hamburger
            isOpen={isMenuOpen}
            onToggle={() => setIsMenuOpen(o => !o)}
            size={40}
          />
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
              y: { duration: 0.52, ease: [0.32, 0.72, 0, 1] },
              scale: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
              opacity: { duration: 0.4, ease: "easeOut" }
            }}
          >
            <div className="h-full flex flex-col items-center justify-center space-y-6 px-6">
              {["Services", "Projects", "About", "Contact", "Blog"].map((item, i) => {
                const targetId = item.toLowerCase();
                const sectionId = idMap[targetId] || targetId;
                const href = targetId === 'blog' ? '/blog' : `/#${sectionId}`;
                const isBlog = item === "Blog";

                return (
                  <motion.a
                    key={item}
                    href={href}
                    onClick={(e) => handleNavClick(e, targetId)}
                    className={
                      isBlog
                        ? "px-8 py-3 bg-[#13a19c]/90 backdrop-blur-sm border border-[#40d6d1]/50 text-white text-2xl font-bold rounded-full shadow-[0_0_20px_rgba(19,161,156,0.5)]"
                        : "text-white text-2xl font-medium"
                    }
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
  );
}
