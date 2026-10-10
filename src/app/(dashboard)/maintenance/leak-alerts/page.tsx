"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { Droplets, AlertTriangle, Zap, CheckCircle2, Wrench, ShieldAlert } from "lucide-react";

export default function MaintenanceLeakAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch("/api/maintenance/leak-alerts");
        const data = await res.json();
        if (data.success && data.alerts) {
          setAlerts(data.alerts);
        }
      } catch (err) {
        console.error("Fetch maintenance leak alerts error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="MAINTENANCE_STAFF" size="sm" />
            <span className="text-xs text-rose-400 font-semibold bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-500/30">
              Acoustic & Telemetry Radar
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Leak & Anomaly Radar Center
            <Droplets className="h-5 w-5 text-cyan-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Autonomous IoT acoustic sensor water leak detection & nighttime phantom energy surge alerts
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading acoustic leak radar telemetry...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alerts.map((alt) => (
            <Card key={alt.id} className="glass-card border-rose-500/30 hover:border-rose-500/50 transition">
              <CardHeader className="pb-3 border-b border-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                        {alt.anomalyType}
                      </span>
                      <CardTitle className="text-sm font-bold text-white">{alt.title}</CardTitle>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {alt.severity} SEVERITY
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-3 text-xs">
                <p className="text-slate-300 leading-relaxed">{alt.description}</p>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Building Location</span>
                  <p className="font-semibold text-white">{alt.buildingName}</p>
                  {alt.diagnosticDetails && (
                    <p className="text-[11px] text-cyan-300 pt-1">
                      <strong>AI Diagnostic: </strong>{alt.diagnosticDetails}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-[11px] text-slate-400">Detected: {new Date(alt.detectedAt).toLocaleTimeString()}</span>
                  <Link href="/maintenance/work-orders">
                    <Button variant="eco" size="sm" className="text-xs gap-1.5 shadow-md shadow-emerald-600/20">
                      <Wrench className="h-3.5 w-3.5" /> Dispatch Work Order
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
