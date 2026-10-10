"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import {
  GraduationCap,
  PlusCircle,
  Zap,
  Users,
  Award,
  Sparkles,
  Send,
  Building,
  CheckCircle2,
} from "lucide-react";

export default function AdminDepartmentManagementPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form State
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formHeadName, setFormHeadName] = useState("");
  const [formEnergyCap, setFormEnergyCap] = useState("40");
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/departments");
      const data = await res.json();
      if (data.success && data.departments) {
        setDepartments(data.departments);
      }
    } catch (err) {
      console.error("Fetch admin departments error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCode) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          code: formCode,
          headName: formHeadName,
          annualEnergyBudgetCapKw: formEnergyCap,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage(data.message);
        setTimeout(() => setToastMessage(""), 3500);
        setShowCreateModal(false);
        setFormName("");
        setFormCode("");
        fetchDepartments();
      }
    } catch (err) {
      console.error("Create department error:", err);
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
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Institutional ESG Budgets
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Department Management & Energy Caps
            <GraduationCap className="h-5 w-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Set departmental peak power limits, monitor carbon offset performance & assign department leads
          </p>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          variant="eco"
          size="sm"
          className="gap-2 shadow-lg shadow-emerald-600/20"
        >
          <PlusCircle className="h-4 w-4" />
          Register Department
        </Button>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* Departments Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading institutional departments...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((dept) => {
            const isOverCap = dept.currentPowerDrawKw > dept.annualEnergyBudgetCapKw;

            return (
              <Card key={dept.id} className="glass-card hover:border-emerald-500/40 transition">
                <CardHeader className="pb-3 border-b border-slate-800">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                        {dept.code}
                      </span>
                      <CardTitle className="text-base font-bold text-white">{dept.name}</CardTitle>
                      <p className="text-[11px] text-slate-400 mt-0.5">Department Head: {dept.headName}</p>
                    </div>

                    <span className="px-2.5 py-1 rounded text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {dept.esgRating}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Live Power Draw</span>
                      <span className={`font-extrabold text-sm ${isOverCap ? "text-rose-400" : "text-emerald-400"}`}>
                        {dept.currentPowerDrawKw} kW
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Power Cap Limit</span>
                      <span className="font-extrabold text-slate-200 text-sm">{dept.annualEnergyBudgetCapKw} kW</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Carbon Offset</span>
                      <span className="font-extrabold text-amber-400 text-sm">{dept.carbonOffsetTonnes} t</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      {dept.studentCount} Students • {dept.facultyCount} Faculty
                    </span>
                    <span
                      className={`font-semibold ${
                        isOverCap ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {isOverCap ? "⚠️ Over Cap Limit" : "✓ Within ESG Target"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Department Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-card border border-emerald-500/40 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                Register Institutional Department
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dept of Bioengineering"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DEPT-BIO-05"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department Head Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Jane Goodall"
                    value={formHeadName}
                    onChange={(e) => setFormHeadName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Power Cap Limit (kW)</label>
                  <input
                    type="number"
                    value={formEnergyCap}
                    onChange={(e) => setFormEnergyCap(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" variant="eco" disabled={submitting} className="text-xs gap-1.5">
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? "Registering..." : "Register Department"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
