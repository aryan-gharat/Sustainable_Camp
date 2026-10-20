import React, { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { Leaf, ShieldCheck, Zap, Droplets } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-[#090D16] text-slate-100">
      {/* Left Branding Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-[#0C1220] border-r border-slate-800">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-600 text-white border border-emerald-500/30">
              <Leaf className="h-4 w-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-100">
                  GreenCampus
                </span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-300 border border-slate-700">
                  BMS
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Facilities & Energy Operations
              </p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 rounded border border-slate-700 bg-[#0F1626] px-3 py-1 text-xs text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Role-Based Access Control Architecture</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-100 leading-tight">
            Unified Energy Telemetry & Campus Facilities Console
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Centralized monitoring for campus electrical substations, chilled water loops, rooftop solar arrays, and student conservation initiatives under verified role governance.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0F1626] border border-slate-700 text-amber-400">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-100 tabular-nums">418 kW</div>
                <div className="text-[11px] text-slate-400">Solar Microgrid Output</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0F1626] border border-slate-700 text-sky-400">
                <Droplets className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-100 tabular-nums">125k Liters</div>
                <div className="text-[11px] text-slate-400">Rainwater Storage</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-slate-500">
          <span>Campus Physical Plant & Facilities • Authorized Personnel Only</span>
        </div>
      </div>

      {/* Right Login Card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <Suspense fallback={<div className="text-xs text-slate-500">Loading portal...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
