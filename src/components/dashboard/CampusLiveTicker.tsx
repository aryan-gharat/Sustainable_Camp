import React from "react";
import { Zap, Sun, Droplets, Sparkles, Activity } from "lucide-react";

export function CampusLiveTicker() {
  return (
    <div className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-4 py-2 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 text-slate-300">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px]">
            Live IoT Telemetry
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-slate-400 hidden sm:inline">
            Smart Microgrid & Sensor Mesh
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-slate-400">Demand:</span>
            <span className="font-semibold text-white">1,480 kW</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Sun className="h-3.5 w-3.5 text-amber-300" />
            <span className="text-slate-400">Solar Gen:</span>
            <span className="font-semibold text-emerald-400">+418 kW (28%)</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <Droplets className="h-3.5 w-3.5 text-sky-400" />
            <span className="text-slate-400">Harvested Water:</span>
            <span className="font-semibold text-white">82% Tank Cap</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-slate-400">AI Grid Efficiency:</span>
            <span className="font-semibold text-purple-300">96.4% Optimal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
