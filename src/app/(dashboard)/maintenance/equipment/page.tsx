"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { Cpu, Zap, Sun, Droplets, CheckCircle2, Clock, MapPin, AlertTriangle } from "lucide-react";

export default function MaintenanceEquipmentPage() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEquipment() {
      try {
        const res = await fetch("/api/maintenance/equipment");
        const data = await res.json();
        if (data.success && data.equipment) {
          setEquipment(data.equipment);
        }
      } catch (err) {
        console.error("Fetch maintenance equipment error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEquipment();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="MAINTENANCE_STAFF" size="sm" />
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              IoT Asset Telemetry
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Equipment & Smart IoT Assets
            <Cpu className="h-5 w-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time status of campus HVAC chillers, rooftop solar inverters, and smart meters
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading IoT equipment assets...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {equipment.map((eq) => (
            <Card key={eq.id} className="glass-card hover:border-emerald-500/40 transition">
              <CardHeader className="pb-3 border-b border-slate-800">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs text-emerald-400 font-bold block mb-1">{eq.serialNumber}</span>
                    <CardTitle className="text-sm font-bold text-white">{eq.name}</CardTitle>
                    <p className="text-[11px] text-slate-400 mt-0.5">{eq.location}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                      eq.status === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    }`}
                  >
                    {eq.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Current Telemetry Reading:</span>
                  <span className="font-black text-emerald-400 text-base">
                    {eq.currentValue} {eq.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Category: {eq.category}</span>
                  <span>Last Sync: {new Date(eq.lastTelemetry).toLocaleTimeString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
