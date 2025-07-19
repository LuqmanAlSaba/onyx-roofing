import type { Metadata } from "next";
import { Open_Sans, Lora } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Casa Del Sol - Home Care Services",
  description: "Compassionate home care with a personal touch. We brighten lives through dedicated companionship, personal care, and everyday support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} ${lora.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
