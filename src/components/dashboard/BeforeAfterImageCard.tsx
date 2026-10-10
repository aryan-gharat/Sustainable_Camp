"use client";

import React, { useState } from "react";
import { ArrowRight, Image as ImageIcon, CheckCircle2, AlertCircle, ZoomIn, X } from "lucide-react";

interface BeforeAfterImageCardProps {
  beforeFixUrl?: string | null;
  afterFixUrl?: string | null;
  title?: string;
  status?: string;
}

export function BeforeAfterImageCard({
  beforeFixUrl,
  afterFixUrl,
  title = "Eco Audit Evidence",
  status,
}: BeforeAfterImageCardProps) {
  const [activeModalImg, setActiveModalImg] = useState<{ url: string; label: string } | null>(null);

  // Default high quality sample images if null
  const defaultBefore = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"; // Leaking pipe / water issue
  const defaultAfter = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"; // Repaired pipe / clean facility

  const displayBefore = beforeFixUrl || defaultBefore;
  const displayAfter = afterFixUrl || defaultAfter;

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <ImageIcon className="h-3.5 w-3.5" />
          Photo Evidence Audit
        </span>
        {status === "VERIFIED" || status === "RESOLVED" ? (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Fix Verified
          </span>
        ) : (
          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Awaiting Maintenance Repair
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 relative">
        {/* BEFORE FIX IMAGE */}
        <div className="space-y-1.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
              Before Fix Image (Student)
            </span>
          </div>

          <div
            onClick={() => setActiveModalImg({ url: displayBefore, label: "Before Fix (Student Upload)" })}
            className="relative h-32 w-full rounded-lg overflow-hidden border border-slate-800 bg-slate-950 cursor-pointer group-hover:border-rose-500/50 transition"
          >
            <img
              src={displayBefore}
              alt="Before Fix Image"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
              <ZoomIn className="h-5 w-5 text-white drop-shadow" />
            </div>
          </div>
        </div>

        {/* AFTER FIX IMAGE */}
        <div className="space-y-1.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              After Fix Image (Maintenance)
            </span>
          </div>

          {afterFixUrl || status === "VERIFIED" || status === "RESOLVED" ? (
            <div
              onClick={() => setActiveModalImg({ url: displayAfter, label: "After Fix (Resolved by Maintenance)" })}
              className="relative h-32 w-full rounded-lg overflow-hidden border border-slate-800 bg-slate-950 cursor-pointer group-hover:border-emerald-500/50 transition"
            >
              <img
                src={displayAfter}
                alt="After Fix Image"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                <ZoomIn className="h-5 w-5 text-white drop-shadow" />
              </div>
            </div>
          ) : (
            <div className="h-32 w-full rounded-lg border border-dashed border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center text-center p-3 text-slate-500">
              <AlertCircle className="h-5 w-5 text-slate-600 mb-1" />
              <span className="text-[10px] font-semibold text-slate-400">After Fix Photo Pending</span>
              <span className="text-[9px] text-slate-500">Uploaded by Engineer upon repair completion</span>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Preview Modal */}
      {activeModalImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative max-w-2xl w-full glass-card border border-slate-700 rounded-2xl overflow-hidden p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-bold text-white text-xs flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-emerald-400" />
                {activeModalImg.label}
              </h4>
              <button
                onClick={() => setActiveModalImg(null)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="h-96 w-full rounded-xl overflow-hidden bg-slate-950">
              <img src={activeModalImg.url} alt="Full Image View" className="h-full w-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
