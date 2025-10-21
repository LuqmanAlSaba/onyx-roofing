"use client";

import { useEffect } from "react";

export default function DeferredFontAwesome() {
  useEffect(() => {
    // Load Font Awesome CSS after initial render
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }, []);

  return null;
}
