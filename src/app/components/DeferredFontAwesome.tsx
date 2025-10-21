"use client";

import { useEffect } from "react";

export default function DeferredFontAwesome() {
  useEffect(() => {
    // Load Font Awesome CSS after initial render
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
    link.integrity = "sha512-bugJ3+Pp4+AoHdbI0W1RCaTq1AdK+/kDKK3S9f+VwIle5Xj2YjGy0sT2BcpQx9L4F0T2tHMWPyClPoHZTLMK7Q==";
    link.crossOrigin = "anonymous";
    link.referrerPolicy = "no-referrer";
    document.head.appendChild(link);
  }, []);

  return null;
}
