"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { BeforeAfterImageCard } from "@/components/dashboard/BeforeAfterImageCard";
import {
  FileText,
  PlusCircle,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Droplets,
  Zap,
  Trash2,
  TreePine,
  Building,
  Sparkles,
  MapPin,
  Send,
  Filter,
  Upload,
  Camera,
  Image as ImageIcon,
} from "lucide-react";

export default function StudentReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("WATER_LEAK");
  const [formLocation, setFormLocation] = useState("");
  const [formBuilding, setFormBuilding] = useState("Solar Science & Tech Complex");
  const [formDescription, setFormDescription] = useState("");
  const [formImpact, setFormImpact] = useState("15");
  const [beforeFixUrl, setBeforeFixUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Preset sample before fix photos for 1-click test upload
  const presetPhotos = [
    { label: "Water Leak", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80" },
    { label: "Energy Waste", url: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80" },
    { label: "Plastic Litter", url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80" },
    { label: "Tree Soil Site", url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80" },
  ];

  const fetchReports = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filterCategory !== "ALL") queryParams.append("category", filterCategory);
      if (filterStatus !== "ALL") queryParams.append("status", filterStatus);

      const res = await fetch(`/api/student/reports?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success && data.reports) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filterCategory, filterStatus]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setBeforeFixUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formLocation || !formDescription) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/student/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          category: formCategory,
          location: formLocation,
          buildingName: formBuilding,
          description: formDescription,
          impactEstKgCo2: formImpact,
          beforeFixUrl: beforeFixUrl || presetPhotos[0].url,
          proofUrl: beforeFixUrl || presetPhotos[0].url,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message || "Report submitted successfully!");
        setFormTitle("");
        setFormDescription("");
        setFormLocation("");
        setBeforeFixUrl("");
        setTimeout(() => {
          setSuccessMsg("");
          setShowSubmitModal(false);
          fetchReports();
        }, 1500);
      }
    } catch (err) {
      console.error("Error submitting report:", err);
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
        return <FileText className="h-4 w-4 text-purple-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            Verified & Resolved
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="h-3 w-3 text-amber-400" />
            Under Facility Review
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <XCircle className="h-3 w-3 text-rose-400" />
            Dismissed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="STUDENT" size="sm" />
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Campus Eco Guard
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Campus Sustainability Reports
            <FileText className="h-5 w-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload Before-Fix photos of resource waste & water leaks to earn Eco-Points and track repairs
          </p>
        </div>

        <Button
          onClick={() => setShowSubmitModal(true)}
          variant="eco"
          size="sm"
          className="gap-2 shadow-lg shadow-emerald-600/20"
        >
          <PlusCircle className="h-4 w-4" />
          Submit New Report (+20 PTS)
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Filter className="h-3.5 w-3.5 text-emerald-400" />
            Category:
          </div>
          {["ALL", "WATER_LEAK", "ENERGY_WASTE", "PLASTIC_HAZARD", "TREE_PLANTING"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filterCategory === cat
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              {cat === "ALL" ? "All Categories" : cat.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading campus sustainability reports...</div>
      ) : reports.length === 0 ? (
        <Card className="glass-card text-center p-8">
          <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No Sustainability Reports Found</p>
          <p className="text-xs text-slate-400 mt-1">Be the first student to audit your dorm or lecture hall!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="glass-card hover:border-emerald-500/30 transition flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3 border-b border-slate-800/60">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        {getCategoryIcon(report.category)}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-white line-clamp-1">{report.title}</CardTitle>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-emerald-400" />
                          {report.location}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>
                </CardHeader>

                <CardContent className="pt-3 space-y-4">
                  <p className="text-xs text-slate-300 line-clamp-3">{report.description}</p>

                  {/* VISUAL BEFORE VS AFTER IMAGE COMPARISON */}
                  <BeforeAfterImageCard
                    beforeFixUrl={report.beforeFixUrl || report.proofUrl}
                    afterFixUrl={report.afterFixUrl}
                    status={report.status}
                  />

                  {report.feedback && (
                    <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-2.5 text-[11px] text-emerald-300">
                      <span className="font-bold text-slate-200">Facility Verification Note: </span>
                      {report.feedback}
                    </div>
                  )}
                </CardContent>
              </div>

              <div className="px-6 py-3 border-t border-slate-800/60 bg-slate-950/40 rounded-b-xl flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-semibold">
                    +{report.pointsAwarded || 20} Eco-Pts
                  </span>
                  <span>{report.buildingName || "Campus Facility"}</span>
                </div>
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Submit Report Modal with Image Upload */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-card border border-emerald-500/30 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                Submit Eco Audit & Before-Fix Photo
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {successMsg ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center font-semibold text-xs">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Report Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Constant Water Drip in Chemistry Lab 2"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="WATER_LEAK">Water Leak / Loss</option>
                      <option value="ENERGY_WASTE">Energy & Lighting Waste</option>
                      <option value="PLASTIC_HAZARD">Single-use Plastic Hazard</option>
                      <option value="TREE_PLANTING">Tree Planting Site Proposal</option>
                      <option value="CAMPUS_AUDIT">General Eco Audit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Building</label>
                    <select
                      value={formBuilding}
                      onChange={(e) => setFormBuilding(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Solar Science & Tech Complex">Solar Science & Tech Complex</option>
                      <option value="Verdant Academic Quad">Verdant Academic Quad</option>
                      <option value="EcoLiving Dormitory Cluster">EcoLiving Dormitory Cluster</option>
                      <option value="Central Memorial Library">Central Memorial Library</option>
                      <option value="Student Union Dining Hall">Student Union Dining Hall</option>
                    </select>
                  </div>
                </div>

                {/* BEFORE FIX IMAGE UPLOAD SECTION */}
                <div className="space-y-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <label className="block text-slate-200 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <Camera className="h-4 w-4" />
                      Upload Before-Fix Image *
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Student Photo Verification</span>
                  </label>

                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="before-photo-upload"
                    />
                    <label
                      htmlFor="before-photo-upload"
                      className="cursor-pointer px-3 py-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/50 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Upload className="h-3.5 w-3.5" /> Select File Photo
                    </label>
                    <span className="text-[11px] text-slate-400">Or pick preset:</span>
                  </div>

                  {/* Preset quick pickers */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {presetPhotos.map((preset, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setBeforeFixUrl(preset.url)}
                        className={`p-1 rounded-lg border text-[10px] font-semibold text-center truncate transition ${
                          beforeFixUrl === preset.url
                            ? "border-rose-500 bg-rose-950/80 text-rose-200"
                            : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {beforeFixUrl && (
                    <div className="mt-2 relative h-28 w-full rounded-lg overflow-hidden border border-rose-500/30 bg-slate-950">
                      <img src={beforeFixUrl} alt="Before Fix Preview" className="h-full w-full object-cover" />
                      <div className="absolute top-1.5 left-1.5 bg-rose-950/90 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-[9px] font-bold">
                        Before Fix Preview
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Exact Location Details *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2nd Floor Men's Washroom Near Room 204"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hazard / Audit Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe what you observed, duration, and estimated environmental impact..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estimated Annual Carbon / Water Loss Impact (kg CO2e)</label>
                  <input
                    type="number"
                    value={formImpact}
                    onChange={(e) => setFormImpact(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSubmitModal(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="eco" disabled={submitting} className="text-xs gap-1.5">
                    <Send className="h-3.5 w-3.5" />
                    {submitting ? "Submitting..." : "Submit Report (+20 PTS)"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
