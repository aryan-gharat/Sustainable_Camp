import React, { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { Leaf, ShieldCheck, Cpu, Zap, Droplets } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Left Branding Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 border-r border-slate-800/80">
        {/* Decorative Grid & Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition">
              <Leaf className="h-6 w-6 fill-current" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                GreenCampus <span className="text-emerald-400">AI</span>
              </span>
              <p className="text-xs text-slate-400">
                Institutional Sustainability OS
              </p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Role-Based Access Control Architecture</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Next-Gen Autonomous Campus Sustainability Management
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Unifying student gamification, faculty research telemetry, facilities
            maintenance dispatch, and executive ESG compliance on an intelligent
            Prisma & PostgreSQL foundation.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">418 kW</div>
                <div className="text-xs text-slate-400">Solar Microgrid Output</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <Droplets className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">82% Cap</div>
                <div className="text-xs text-slate-400">Rainwater Harvesting</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          <span>Production Ready • Next.js 15 & JWT Auth</span>
          <span>Security Level: Enterprise RBAC</span>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <Suspense fallback={<div className="text-slate-400 text-xs">Loading login portal...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
