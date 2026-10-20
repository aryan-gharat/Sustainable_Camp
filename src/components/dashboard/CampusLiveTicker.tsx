import React from "react";
import { Zap, Sun, Droplets, Gauge, Activity } from "lucide-react";

export function CampusLiveTicker() {
  return (
    <div className="border-b border-slate-800 bg-[#0A0E17] px-4 py-2 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 text-slate-300">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="inline-flex rounded-full h-2 w-2 bg-emerald-500 ring-2 ring-emerald-500/30"></span>
          </span>
          <span className="font-semibold text-slate-200 tracking-wider text-[11px] uppercase">
            BMS Substation Telemetry
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            Status: Normal Operations
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] tabular-nums">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-slate-400">Demand:</span>
            <span className="font-semibold text-slate-100">1,480 kW</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Sun className="h-3.5 w-3.5 text-amber-300" />
            <span className="text-slate-400">Solar PV:</span>
            <span className="font-semibold text-emerald-400">418 kW (28%)</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <Droplets className="h-3.5 w-3.5 text-sky-400" />
            <span className="text-slate-400">Rainwater Cistern:</span>
            <span className="font-semibold text-slate-100">82% (145k gal)</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-400">Chilled Loop COP:</span>
            <span className="font-semibold text-slate-200">5.82</span>
          </div>
        </div>
      </div>
    </div>
  );
}
