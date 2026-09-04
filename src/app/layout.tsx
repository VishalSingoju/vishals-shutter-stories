import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { cn } from "@/lib/utils";

// Editorial serif with system fallback to prevent build stalls
const fraunces = Fraunces({
  
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Vishal's Shutter Stories",
  description: "Documentary & Editorial Photography",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(fraunces.variable, inter.variable, "font-sans")}>
      <body className="antialiased bg-[#FDFBF7] text-[#1C1917]">
        <NavBar />
        {children}
      </body>
    </html>
  );
}