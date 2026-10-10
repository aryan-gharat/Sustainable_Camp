import React from "react";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Leaf, Award, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Left Branding Showcase */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950/40 border-r border-slate-800/80">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
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

        <div className="relative z-10 space-y-6 my-auto max-w-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/40 px-3 py-1 text-xs text-teal-300">
            <Award className="h-3.5 w-3.5" />
            <span>Role-Based Campus Registration</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Accelerating Campus Decarbonization Together
          </h2>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Students:</strong> Earn verifiable eco-points, join dorm
                energy blackout quests, and climb the campus leaderboard.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Faculty:</strong> Automate classroom smart HVAC schedules
                and monitor laboratory sustainability indexes.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Maintenance:</strong> Receive autonomous acoustic water leak
                alerts and dispatch urgent repairs.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Admins:</strong> Oversee real-time campus microgrid
                generation, carbon offsets, and ESG compliance.
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          Next.js 15 & PostgreSQL Security Standards
        </div>
      </div>

      {/* Right Register Form */}
      <div className="flex w-full lg:w-7/12 items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <RegisterForm />
      </div>
    </div>
  );
}
