import React from "react";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Leaf, Award, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-[#090D16] text-slate-100">
      {/* Left Branding Showcase */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden bg-[#0C1220] border-r border-slate-800">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
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

        <div className="relative z-10 space-y-6 my-auto max-w-sm">
          <div className="inline-flex items-center gap-2 rounded border border-slate-700 bg-[#0F1626] px-3 py-1 text-xs text-slate-300">
            <Award className="h-3.5 w-3.5 text-emerald-400" />
            <span>Campus Identity & Role Registration</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-100 leading-tight">
            Institutional Decarbonization & Resource Governance
          </h2>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Students:</strong> Earn verifiable eco-points, participate in dorm
                energy conservation challenges, and track personal footprints.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Faculty:</strong> Monitor departmental lab equipment power draws
                and apply for campus sustainability research grants.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Maintenance:</strong> Receive prioritized acoustic water leak alerts
                and dispatch physical plant work orders.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Administration:</strong> Review high-level campus ESG ratings, approve
                facility reports, and manage departmental energy limits.
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-slate-500">
          <span>Campus Physical Plant & Facilities • Authorized Access Only</span>
        </div>
      </div>

      {/* Right Registration Card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <RegisterForm />
      </div>
    </div>
  );
}
