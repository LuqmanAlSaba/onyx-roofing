"use client";

import { useEffect } from "react";

export default function DeferredFontAwesome() {
  useEffect(() => {
    // Use the "print" media trick for non-blocking CSS loading
    // This loads the CSS without blocking render, then switches to "all" when loaded
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css";
    link.integrity = "sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==";
    link.crossOrigin = "anonymous";
    link.referrerPolicy = "no-referrer";
    link.media = "print"; // Non-blocking: load as print stylesheet initially
    link.onload = function() {
      // Switch to all media types once loaded
      link.media = "all";
    };
    document.head.appendChild(link);
  }, []);

  return null;
}
