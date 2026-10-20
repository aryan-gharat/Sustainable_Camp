import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GreenCampus | Campus Sustainability & Energy Operations",
  description:
    "Institutional energy management, building sub-meter telemetry, facility maintenance workflows, and student sustainability initiatives.",
  keywords: [
    "Campus Sustainability",
    "Facility Management",
    "Building Energy Operations",
    "IoT Sub-Metering",
    "Higher Education ESG",
  ],
  authors: [{ name: "Campus Facilities & Sustainability Division" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#090D16] text-slate-100 antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
