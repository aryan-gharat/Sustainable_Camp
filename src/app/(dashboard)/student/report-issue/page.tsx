import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Droplets, Zap, Trash2, Send } from "lucide-react";

export default function StudentReportIssuePage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-b border-slate-800 pb-5 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-2">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Report Campus Eco-Waste or Leak
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Spotted a dripping tap, running HVAC in an empty lecture hall, or overflowing bin?
          Dispatch a priority maintenance alert and earn 30 Eco-Points.
        </p>
      </div>

      <Card className="glass-card">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Category of Issue</label>
            <div className="grid grid-cols-3 gap-2">
              <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-sky-500/40 bg-sky-950/20 text-sky-300 text-xs gap-1">
                <Droplets className="h-4 w-4" />
                <span>Water Leak</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 text-xs gap-1">
                <Zap className="h-4 w-4" />
                <span>Power Waste</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 text-xs gap-1">
                <Trash2 className="h-4 w-4" />
                <span>Bin Overflow</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Location (Building & Room #)</label>
            <Input placeholder="e.g. Science Complex, 2nd floor restrooms" className="text-xs" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Description of Issue</label>
            <textarea
              rows={3}
              placeholder="Provide specific details so maintenance staff can resolve immediately..."
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <Button variant="eco" className="w-full gap-2 text-xs">
            <Send className="h-3.5 w-3.5" />
            Dispatch Work Order to Facilities (+30 PTS)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
