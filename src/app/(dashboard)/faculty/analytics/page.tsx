"use client";

import React from "react";
import { SustainabilityAnalyticsDashboard } from "@/components/dashboard/SustainabilityAnalyticsDashboard";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { BarChart3 } from "lucide-react";

export default function FacultyAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="FACULTY" size="sm" />
            <span className="text-xs text-blue-400 font-semibold bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-500/30">
              Department & Microgrid Telemetry
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Department Sustainability Analytics
            <BarChart3 className="h-5 w-5 text-blue-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive Recharts telemetry for energy draw, rooftop solar PV generation, water usage & waste diversion
          </p>
        </div>
      </div>

      {/* Interactive Recharts Component */}
      <SustainabilityAnalyticsDashboard />
    </div>
  );
}
