import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600"],
  display: "swap",
  preload: true,
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Onyx Roofing - Professional Roofing Services Louisville, KY | Free Inspection",
  description: "Professional roofing services in Louisville, Kentucky. Roof replacement, repair, storm damage, and gutter installation. Licensed & insured. Free inspection. Call (502) 207-3007.",
  keywords: [
    "roofing services Louisville KY",
    "roof replacement Kentucky",
    "roof repair Louisville",
    "storm damage repair",
    "gutter installation",
    "roofing contractor Louisville",
    "free roof inspection",
    "licensed roofing company",
    "Kentucky roofing services",
    "emergency roof repair"
  ],
  authors: [{ name: "Onyx Roofing" }],
  creator: "Onyx Roofing",
  publisher: "Onyx Roofing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://onyxroofingpro.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Onyx Roofing - Professional Roofing Services Louisville, KY",
    description: "Professional roofing services in Louisville, Kentucky. Roof replacement, repair, storm damage, and gutter installation. Licensed & insured. Free inspection.",
    url: 'https://onyxroofingpro.com',
    siteName: 'Onyx Roofing',
    images: [
      {
        url: '/onyx-roofing-logo-black.webp',
        width: 1200,
        height: 630,
        alt: 'Onyx Roofing - Professional Roofing Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Onyx Roofing - Professional Roofing Services Louisville, KY",
    description: "Professional roofing services in Louisville, Kentucky. Roof replacement, repair, storm damage, and gutter installation. Licensed & insured. Free inspection.",
    images: ['/onyx-roofing-logo-black.webp'],
    site: '@OnyxRoofingPro',
    creator: '@OnyxRoofingPro',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'm03Dr-iYrbHZoqklVdgP9vNyJFzHg77qvLB6djTvGq0',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon0.svg', type: 'image/svg+xml' },
      { url: '/icon1.png', type: 'image/png' }
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  other: {
    'geo.region': 'US-KY',
    'geo.placename': 'Louisville, Kentucky',
    'geo.position': '38.2527;-85.7585',
    'ICBM': '38.2527, -85.7585',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect hints for external resources */}
        <link rel="preconnect" href="https://api.openweathermap.org" />
        
        {/* DNS prefetch for additional performance */}
        <link rel="dns-prefetch" href="https://api.openweathermap.org" />
        
        {/* Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RoofingContractor",
              "name": "Onyx Roofing",
              "description": "Professional roofing services in Louisville, Kentucky. Specializing in roof replacement, repair, storm damage, and gutter installation.",
              "url": "https://onyxroofingpro.com",
              "telephone": "+1-502-207-3007",
              "email": "info@onyxroofingpro.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Louisville",
                "addressRegion": "KY",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 38.2527,
                "longitude": -85.7585
              },
              "areaServed": [
                "Louisville, KY",
                "Lexington, KY", 
                "Bowling Green, KY",
                "Owensboro, KY",
                "Covington, KY",
                "Kentucky"
              ],
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 38.2527,
                  "longitude": -85.7585
                },
                "geoRadius": "50000"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Roofing Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Roof Replacement",
                      "description": "Complete roof replacement services"
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Roof Repair",
                      "description": "Emergency and scheduled roof repairs"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "Storm Damage Repair",
                      "description": "Storm damage assessment and repair"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Gutter Installation",
                      "description": "Professional gutter installation services"
                    }
                  }
                ]
              },
              "priceRange": "$$",
              "paymentAccepted": ["Cash", "Check", "Credit Card"],
              "currenciesAccepted": "USD",
              "openingHours": "Mo-Su 08:00-18:00",
              "sameAs": [
                "https://www.facebook.com/profile.php?id=61578690514178",
                "https://www.instagram.com/onyxroofingpro/"
              ]
            })
          }}
        />
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Onyx Roofing",
              "url": "https://onyxroofingpro.com",
              "logo": "https://onyxroofingpro.com/onyx-roofing-logo-black.webp",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-502-207-3007",
                "contactType": "customer service",
                "availableLanguage": "English"
              }
            })
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#192119" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image:alt" content="Onyx Roofing - Professional Roofing Services" />
      </head>
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
