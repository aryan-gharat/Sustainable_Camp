"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import {
  Building2,
  PlusCircle,
  Sun,
  Droplets,
  Award,
  Zap,
  Sparkles,
  Send,
  CheckCircle2,
  Activity,
  Layers,
} from "lucide-react";

export default function AdminBuildingManagementPage() {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form State
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formCategory, setFormCategory] = useState("ACADEMIC");
  const [formArea, setFormArea] = useState("12000");
  const [formCapacity, setFormCapacity] = useState("600");
  const [formSolar, setFormSolar] = useState(true);
  const [formRainwater, setFormRainwater] = useState(true);
  const [formRating, setFormRating] = useState("LEED Gold");
  const [submitting, setSubmitting] = useState(false);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/buildings");
      const data = await res.json();
      if (data.success && data.buildings) {
        setBuildings(data.buildings);
      }
    } catch (err) {
      console.error("Fetch admin buildings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const handleCreateBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCode) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/buildings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          code: formCode,
          category: formCategory,
          grossFloorAreaSqM: formArea,
          occupancyCapacity: formCapacity,
          solarPanelsInstalled: formSolar,
          rainwaterHarvesting: formRainwater,
          currentEnergyRating: formRating,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage(data.message);
        setTimeout(() => setToastMessage(""), 3500);
        setShowCreateModal(false);
        setFormName("");
        setFormCode("");
        fetchBuildings();
      }
    } catch (err) {
      console.error("Create building error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="ADMIN" size="sm" />
            <span className="text-xs text-blue-400 font-semibold bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-500/30">
              Campus Facilities & Infrastructure Digital Twin
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Building Infrastructure & IoT Meter Grid
            <Building2 className="h-5 w-5 text-blue-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage campus facility footprints, solar array installations, LEED ratings & connected smart meters
          </p>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          variant="eco"
          size="sm"
          className="gap-2 shadow-lg shadow-emerald-600/20"
        >
          <PlusCircle className="h-4 w-4" />
          Add Building Model
        </Button>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-semibold text-center shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* Buildings Roster Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading campus building infrastructure...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {buildings.map((bld) => (
            <Card key={bld.id} className="glass-card hover:border-blue-500/40 transition">
              <CardHeader className="pb-3 border-b border-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider block mb-1">
                      {bld.code}
                    </span>
                    <CardTitle className="text-base font-bold text-white">{bld.name}</CardTitle>
                    <p className="text-[11px] text-slate-400 mt-0.5">Category: {bld.category}</p>
                  </div>

                  <span className="px-2.5 py-1 rounded text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {bld.currentEnergyRating || "LEED Gold"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Gross Floor Area</span>
                    <span className="font-extrabold text-white text-sm">
                      {bld.grossFloorAreaSqM ? bld.grossFloorAreaSqM.toLocaleString() : "12,000"} m²
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Max Occupancy</span>
                    <span className="font-extrabold text-white text-sm">
                      {bld.occupancyCapacity || 500} People
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs pt-1">
                  <span
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${
                      bld.solarPanelsInstalled
                        ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        : "bg-slate-900 text-slate-500 border-slate-800"
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5 text-amber-400" />
                    {bld.solarPanelsInstalled ? "Rooftop Solar Active" : "No Solar Array"}
                  </span>

                  <span
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${
                      bld.rainwaterHarvesting
                        ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                        : "bg-slate-900 text-slate-500 border-slate-800"
                    }`}
                  >
                    <Droplets className="h-3.5 w-3.5 text-cyan-400" />
                    {bld.rainwaterHarvesting ? "Rainwater System Active" : "No Catchment"}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-emerald-400" />
                    Connected Meters: {bld.meters ? bld.meters.length : 1} IoT Units
                  </span>
                  <span className="text-emerald-400 font-semibold">Status: Active Sync</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Building Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-card border border-blue-500/40 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                Add Building to Campus Grid
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBuilding} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Building Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Innovation Center B"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Building Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BLD-INN-05"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="ACADEMIC">ACADEMIC</option>
                    <option value="LABORATORY">LABORATORY</option>
                    <option value="DORMITORY">DORMITORY</option>
                    <option value="LIBRARY">LIBRARY</option>
                    <option value="DINING">DINING</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Area (m²)</label>
                  <input
                    type="number"
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Occupancy</label>
                  <input
                    type="number"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">LEED / ESG Rating</label>
                  <select
                    value={formRating}
                    onChange={(e) => setFormRating(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="LEED Platinum">LEED Platinum</option>
                    <option value="LEED Gold">LEED Gold</option>
                    <option value="Net-Zero Ready">Net-Zero Ready</option>
                    <option value="EnergyStar 90+">EnergyStar 90+</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formSolar}
                      onChange={(e) => setFormSolar(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span className="text-slate-200">Rooftop Solar</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formRainwater}
                      onChange={(e) => setFormRainwater(e.target.checked)}
                      className="accent-cyan-500"
                    />
                    <span className="text-slate-200">Rainwater</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" variant="eco" disabled={submitting} className="text-xs gap-1.5">
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? "Adding..." : "Add Building & Smart Meter"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
