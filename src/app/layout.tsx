import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenCampus AI | Next-Gen Sustainable Campus Intelligence",
  description:
    "Autonomous energy optimization, IoT water telemetry, smart waste management, and gamified campus eco-action powered by AI.",
  keywords: [
    "Sustainable Campus",
    "Smart Campus",
    "Energy Management",
    "IoT Telemetry",
    "Net Zero",
    "Green Campus AI",
  ],
  authors: [{ name: "GreenCampus AI Engineering Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
