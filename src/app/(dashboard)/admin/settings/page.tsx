import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Shield, Bell, Database, Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-slate-400" />
            GreenCampus AI System & Threshold Configurations
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure IoT telemetry sampling intervals, anomaly trigger thresholds, and RBAC policies
          </p>
        </div>

        <Button variant="eco" size="sm" className="gap-1.5 text-xs">
          <Save className="h-3.5 w-3.5" />
          Save Configurations
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4 text-emerald-400" />
              Automated Alert Sensitivity
            </CardTitle>
            <CardDescription>Configure when AI triggers emergency maintenance tickets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-2 rounded bg-slate-950/40 border border-slate-800">
              <div>
                <p className="font-semibold text-white">Continuous Water Leak Threshold</p>
                <p className="text-[11px] text-slate-400">Trigger alert if baseline flow persists</p>
              </div>
              <span className="font-mono text-emerald-400">&gt; 8.0 L/min</span>
            </div>

            <div className="flex justify-between items-center p-2 rounded bg-slate-950/40 border border-slate-800">
              <div>
                <p className="font-semibold text-white">Power Surge Deviation</p>
                <p className="text-[11px] text-slate-400">Deviation from 30-day moving average</p>
              </div>
              <span className="font-mono text-amber-400">+25% Above Mean</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-400" />
              Database & Prisma Connection Info
            </CardTitle>
            <CardDescription>PostgreSQL connection parameters and schema state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded bg-slate-950/40 border border-slate-800 space-y-1 font-mono text-[11px]">
              <div>Engine: <span className="text-emerald-400">Prisma Client v6.19.3</span></div>
              <div>Database: <span className="text-blue-400">PostgreSQL 16</span></div>
              <div>JWT Algorithm: <span className="text-purple-400">HS256 (Jose Runtime)</span></div>
              <div>Security: <span className="text-emerald-400">Strict HTTP-Only Cookie</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
