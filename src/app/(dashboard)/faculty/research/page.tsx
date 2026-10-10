import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Microscope, Activity, Flame, ShieldCheck } from "lucide-react";

export default function FacultyResearchPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Microscope className="h-6 w-6 text-blue-400" />
          Laboratory Equipment & Hazardous Reduction Metrics
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Fume hood sash management, cryogenic storage efficiency, and clean-tech prototype logs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Fume Hood Airflow Telemetry</CardTitle>
            <CardDescription>Variable Air Volume (VAV) sensors monitoring exhaust velocity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Active Hoods:</span>
                <span className="font-semibold text-white">12 Hoods</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sash Lowered Compliance:</span>
                <span className="font-semibold text-emerald-400">92% Compliance</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Annual Energy Avoidance:</span>
                <span className="font-semibold text-emerald-400">$8,400 saved</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Cryogenic & Cold Storage Optimization</CardTitle>
            <CardDescription>-80°C ultra-low temperature (ULT) freezer efficiency program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Total ULT Freezers:</span>
                <span className="font-semibold text-white">8 Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Chill-Up from -80°C to -70°C:</span>
                <span className="font-semibold text-emerald-400">6 Adopted (30% less power)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
