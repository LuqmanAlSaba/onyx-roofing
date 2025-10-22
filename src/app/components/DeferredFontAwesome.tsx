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

      // Inject font-display: swap overrides AFTER FontAwesome CSS loads
      // This ensures our overrides take precedence over CDN's @font-face declarations
      const style = document.createElement("style");
      style.textContent = `
        @font-face {
          font-family: "Font Awesome 6 Brands";
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/webfonts/fa-brands-400.woff2") format("woff2");
        }

        @font-face {
          font-family: "Font Awesome 6 Free";
          font-style: normal;
          font-weight: 900;
          font-display: swap;
          src: url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/webfonts/fa-solid-900.woff2") format("woff2");
        }

        @font-face {
          font-family: "Font Awesome 6 Free";
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/webfonts/fa-regular-400.woff2") format("woff2");
        }
      `;
      document.head.appendChild(style);
    };
    document.head.appendChild(link);
  }, []);

  return null;
}
