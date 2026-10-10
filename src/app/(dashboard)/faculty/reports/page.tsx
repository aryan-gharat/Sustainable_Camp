"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Droplets,
  Zap,
  Trash2,
  TreePine,
  Sparkles,
  Filter,
  Send,
} from "lucide-react";

export default function FacultyReportsReviewPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("PENDING");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [awardPoints, setAwardPoints] = useState("50");
  const [facultyFeedback, setFacultyFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/faculty/reports?status=${filterStatus}`);
      const data = await res.json();
      if (data.success && data.reports) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error("Fetch faculty reports review error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filterStatus]);

  const handleReview = async (status: "VERIFIED" | "REJECTED") => {
    if (!selectedReport) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/faculty/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: selectedReport.id,
          status,
          pointsAwarded: awardPoints,
          feedback: facultyFeedback || (status === "VERIFIED" ? "Verified by Faculty Board." : "Report dismissed."),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage(data.message);
        setTimeout(() => setToastMessage(""), 3500);
        setSelectedReport(null);
        setFacultyFeedback("");
        fetchReports();
      }
    } catch (err) {
      console.error("Review report error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "WATER_LEAK":
        return <Droplets className="h-4 w-4 text-blue-400" />;
      case "ENERGY_WASTE":
        return <Zap className="h-4 w-4 text-amber-400" />;
      case "PLASTIC_HAZARD":
        return <Trash2 className="h-4 w-4 text-rose-400" />;
      case "TREE_PLANTING":
        return <TreePine className="h-4 w-4 text-emerald-400" />;
      default:
        return <ClipboardList className="h-4 w-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="FACULTY" size="sm" />
            <span className="text-xs text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
              Audit Governance
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Student Sustainability Reports Review
            <ClipboardList className="h-5 w-5 text-amber-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate student eco audit submissions, verify facility hazards, allocate eco-points & trigger work orders
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold text-center shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 glass-card p-4 rounded-xl border border-slate-800">
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-amber-400" />
          Status Filter:
        </span>
        {["PENDING", "VERIFIED", "REJECTED", "ALL"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterStatus === st
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            {st} Reports
          </button>
        ))}
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading student reports...</div>
      ) : reports.length === 0 ? (
        <Card className="glass-card text-center p-8">
          <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No Reports Requiring Action</p>
          <p className="text-xs text-slate-400 mt-1">All student eco audits in this view have been processed.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep) => (
            <Card key={rep.id} className="glass-card hover:border-amber-500/40 transition">
              <CardHeader className="pb-3 border-b border-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      {getCategoryIcon(rep.category)}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-white line-clamp-1">{rep.title}</CardTitle>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Submitted by <span className="font-semibold text-emerald-400">{rep.user?.name || "Student"}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      rep.status === "VERIFIED"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : rep.status === "PENDING"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                    }`}
                  >
                    {rep.status}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">{rep.description}</p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-amber-400" />
                    <span className="truncate">{rep.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Est Impact: </span>
                    <span className="font-semibold text-emerald-400">{rep.impactEstKgCo2} kg CO2</span>
                  </div>
                </div>

                {rep.feedback && (
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-emerald-300">
                    <span className="font-bold text-slate-200">Feedback: </span>
                    {rep.feedback}
                  </div>
                )}

                {rep.status === "PENDING" && (
                  <div className="pt-2 flex justify-end">
                    <Button
                      onClick={() => setSelectedReport(rep)}
                      variant="eco"
                      size="sm"
                      className="text-xs gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Review & Grade Report
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-card border border-amber-500/40 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                Review & Verify Sustainability Report
              </h3>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="font-bold text-white text-sm">{selectedReport.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">By {selectedReport.user?.name} • {selectedReport.location}</p>
                <p className="text-slate-300 mt-2">{selectedReport.description}</p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Eco-Points to Award Student</label>
                <select
                  value={awardPoints}
                  onChange={(e) => setAwardPoints(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none"
                >
                  <option value="30">+30 Eco-Points (Standard Hazard Report)</option>
                  <option value="50">+50 Eco-Points (Verified Water/Energy Leak)</option>
                  <option value="100">+100 Eco-Points (Major Campus Eco Audit)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Faculty Review Notes / Work Order Instructions</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Verified by Faculty. Dispatched work order WO-2026-085 to Maintenance Engineers."
                  value={facultyFeedback}
                  onChange={(e) => setFacultyFeedback(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleReview("REJECTED")}
                  disabled={submitting}
                  className="text-xs text-rose-400 border-rose-500/30 hover:bg-rose-950/40 gap-1"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Dismiss Report
                </Button>
                <Button
                  type="button"
                  variant="eco"
                  onClick={() => handleReview("VERIFIED")}
                  disabled={submitting}
                  className="text-xs gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {submitting ? "Processing..." : `Approve & Award +${awardPoints} PTS`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
