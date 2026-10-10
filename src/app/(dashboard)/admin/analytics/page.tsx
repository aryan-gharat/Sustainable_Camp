"use client";

import React from "react";
import { SustainabilityAnalyticsDashboard } from "@/components/dashboard/SustainabilityAnalyticsDashboard";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { BarChart3 } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="ADMIN" size="sm" />
            <span className="text-xs text-teal-400 font-semibold bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-500/30">
              Executive Recharts Telemetry
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Campus Sustainability Analytics Dashboard
            <BarChart3 className="h-5 w-5 text-teal-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive Recharts telemetry for energy consumption, water usage, waste management, carbon footprint & ESG score
          </p>
        </div>
      </div>

      {/* Interactive Recharts Component */}
      <SustainabilityAnalyticsDashboard />
    </div>
  );
}
