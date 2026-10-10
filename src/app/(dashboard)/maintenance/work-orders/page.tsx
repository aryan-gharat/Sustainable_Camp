"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { BeforeAfterImageCard } from "@/components/dashboard/BeforeAfterImageCard";
import {
  Wrench,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  Play,
  Sparkles,
  Send,
  Filter,
  User,
  Leaf,
  Camera,
  Upload,
} from "lucide-react";

export default function MaintenanceWorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedWO, setSelectedWO] = useState<any>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [actualCarbonSaved, setActualCarbonSaved] = useState("35");
  const [afterFixUrl, setAfterFixUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const presetAfterPhotos = [
    { label: "Fixed Valve/Pipe", url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80" },
    { label: "Calibrated HVAC", url: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80" },
    { label: "Cleaned Bin Site", url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80" },
  ];

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/maintenance/work-orders?status=${filterStatus}`);
      const data = await res.json();
      if (data.success && data.workOrders) {
        setWorkOrders(data.workOrders);
      }
    } catch (err) {
      console.error("Fetch maintenance work orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, [filterStatus]);

  const handleStartRepair = async (workOrderId: string) => {
    try {
      const res = await fetch("/api/maintenance/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workOrderId, status: "IN_PROGRESS" }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage("Work Order status updated to 'IN_PROGRESS'.");
        setTimeout(() => setToastMessage(""), 3000);
        fetchWorkOrders();
      }
    } catch (err) {
      console.error("Start repair error:", err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setAfterFixUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResolveIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWO || !resolutionNotes) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/maintenance/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workOrderId: selectedWO.id,
          status: "RESOLVED",
          resolutionNotes,
          actualCarbonSavedKg: actualCarbonSaved,
          afterFixUrl: afterFixUrl || presetAfterPhotos[0].url,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage(data.message || "Issue resolved! Student notified with After-Fix photo.");
        setTimeout(() => setToastMessage(""), 4000);
        setSelectedWO(null);
        setResolutionNotes("");
        setAfterFixUrl("");
        fetchWorkOrders();
      }
    } catch (err) {
      console.error("Resolve work order error:", err);
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
            <RoleBadge role="MAINTENANCE_STAFF" size="sm" />
            <span className="text-xs text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
              Work Order Lifecycle Execution
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Active Work Orders & Repair Center
            <Wrench className="h-5 w-5 text-amber-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            5-Stage Workflow: Student Uploads Photo (Before) → Admin Approves → Maintenance Resolves (After Photo) → Student Notified
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center gap-3 glass-card p-4 rounded-xl border border-slate-800">
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-amber-400" />
          Status Filter:
        </span>
        {["ALL", "ASSIGNED", "IN_PROGRESS", "RESOLVED"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterStatus === st
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            {st} Work Orders
          </button>
        ))}
      </div>

      {/* Work Orders List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading work order dispatch queue...</div>
      ) : workOrders.length === 0 ? (
        <Card className="glass-card text-center p-8">
          <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No Work Orders Found</p>
          <p className="text-xs text-slate-400 mt-1">All assigned facility repair tickets are up to date.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workOrders.map((wo) => (
            <Card key={wo.id} className="glass-card hover:border-amber-500/40 transition flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3 border-b border-slate-800">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-amber-400">{wo.workOrderNumber}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            wo.priority === "HIGH"
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {wo.priority} Priority
                        </span>
                      </div>
                      <CardTitle className="text-base font-bold text-white">{wo.title}</CardTitle>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded text-xs font-extrabold border ${
                        wo.status === "RESOLVED"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : wo.status === "IN_PROGRESS"
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {wo.status}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed">{wo.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{wo.locationDetails}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{wo.reportedBy?.name || "Student Audit"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Leaf className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Est Carbon Loss: <strong className="text-emerald-400">{wo.estimatedCarbonLossKg || 20.0} kg CO2e</strong></span>
                    </div>
                  </div>

                  {/* VISUAL BEFORE VS AFTER IMAGE COMPARISON */}
                  <BeforeAfterImageCard
                    beforeFixUrl={wo.beforeFixUrl}
                    afterFixUrl={wo.afterFixUrl}
                    status={wo.status}
                  />

                  {wo.resolutionNotes && (
                    <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 space-y-0.5">
                      <span className="font-bold block text-white">Engineer Resolution Notes:</span>
                      <p className="text-[11px]">{wo.resolutionNotes}</p>
                    </div>
                  )}
                </CardContent>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-950/40 rounded-b-xl flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Assigned: {wo.assignedTo?.name || "Carlos Mendez"}</span>

                {wo.status === "ASSIGNED" && (
                  <Button
                    onClick={() => handleStartRepair(wo.id)}
                    variant="outline"
                    size="sm"
                    className="text-xs border-blue-500/30 text-blue-300 hover:bg-blue-950/40 gap-1.5"
                  >
                    <Play className="h-3.5 w-3.5 text-blue-400" /> Start Repair
                  </Button>
                )}

                {wo.status === "IN_PROGRESS" && (
                  <Button
                    onClick={() => {
                      setSelectedWO(wo);
                      setAfterFixUrl(presetAfterPhotos[0].url);
                    }}
                    variant="eco"
                    size="sm"
                    className="text-xs gap-1.5 shadow-lg shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Mark Issue Resolved (Upload After-Fix)
                  </Button>
                )}

                {wo.status === "RESOLVED" && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Student Notified & Photo Verified
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Resolution Notes & After-Fix Photo Upload Modal */}
      {selectedWO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-card border border-emerald-500/40 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                Complete Repair & Upload After-Fix Photo
              </h3>
              <button onClick={() => setSelectedWO(null)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleResolveIssue} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-mono font-bold text-amber-400 text-[11px] block">{selectedWO.workOrderNumber}</span>
                <h4 className="font-bold text-white text-sm mt-0.5">{selectedWO.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Location: {selectedWO.locationDetails}</p>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                  Reported by: {selectedWO.reportedBy?.name || "Student"}
                </p>
              </div>

              {/* AFTER FIX PHOTO UPLOAD SECTION */}
              <div className="space-y-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <label className="block text-slate-200 font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Camera className="h-4 w-4" />
                    Upload After-Fix Image (Maintenance Proof) *
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Facilities Verification</span>
                </label>

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="after-photo-upload"
                  />
                  <label
                    htmlFor="after-photo-upload"
                    className="cursor-pointer px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Upload className="h-3.5 w-3.5" /> Select Repair Photo
                  </label>
                  <span className="text-[11px] text-slate-400">Or pick preset:</span>
                </div>

                {/* Preset quick pickers */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {presetAfterPhotos.map((preset, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setAfterFixUrl(preset.url)}
                      className={`p-1 rounded-lg border text-[10px] font-semibold text-center truncate transition ${
                        afterFixUrl === preset.url
                          ? "border-emerald-500 bg-emerald-950/80 text-emerald-200"
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {afterFixUrl && (
                  <div className="mt-2 relative h-28 w-full rounded-lg overflow-hidden border border-emerald-500/30 bg-slate-950">
                    <img src={afterFixUrl} alt="After Fix Preview" className="h-full w-full object-cover" />
                    <div className="absolute top-1.5 left-1.5 bg-emerald-950/90 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[9px] font-bold">
                      After Fix Preview
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Resolution Notes (Detailed Repair Summary) *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Replaced 2-inch chiller seal valve; pressure restored to 4.2 bar; verified zero dripping."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Actual Carbon / Water Saved (kg CO2e)</label>
                <input
                  type="number"
                  value={actualCarbonSaved}
                  onChange={(e) => setActualCarbonSaved(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-300">
                ✓ Completing this repair will notify <strong>{selectedWO.reportedBy?.name || "the student"}</strong> with After-Fix visual evidence, log +30 Eco-Points to their profile, and mark their eco report as <strong>Verified & Resolved</strong>.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setSelectedWO(null)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" variant="eco" disabled={submitting} className="text-xs gap-1.5 shadow-lg shadow-emerald-600/20">
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? "Resolving..." : "Resolve & Notify Student (+30 PTS)"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
