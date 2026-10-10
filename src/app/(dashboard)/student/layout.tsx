import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { CampusLiveTicker } from "@/components/dashboard/CampusLiveTicker";
import { AISustainabilityAdvisor } from "@/components/ai/AISustainabilityAdvisor";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 relative">
      <Sidebar
        role="STUDENT"
        userName={user?.name || "Aiden Sharma"}
        userEmail={user?.email || "student@greencampus.ai"}
      />

      <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
        <CampusLiveTicker />
        <Topbar
          currentRole="STUDENT"
          title="Student Eco-Action Portal"
          subtitle="Gamified Sustainability, Green Quests & Carbon Footprint Tracking"
          userName={user?.name || "Aiden Sharma"}
        />
        <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Floating AI Sustainability Advisor Widget */}
      <AISustainabilityAdvisor />
    </div>
  );
}
