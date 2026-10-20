import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ShieldAlert, Cpu, ArrowRight, Gauge, Activity, Zap } from "lucide-react";

export default function AdminAIInsightsPage() {
  const insights = [
    {
      id: "opt-01",
      title: "Solar PV Midday Peak Shifting",
      target: "Science Complex & Campus EV Charging Hub",
      confidence: "94% Model Confidence (14-Day Baseline)",
      impact: "Est. $480/mo savings & 1.85 MT CO2 reduction",
      summary:
        "Excess rooftop generation (420 kW) detected during midday hours. System recommends pre-cooling lecture halls and routing charging circuits to absorb peak production without backfeeding the municipal grid at lower feed-in tariffs.",
      category: "Peak Load Shifting",
      status: "Awaiting Dispatch",
    },
    {
      id: "opt-02",
      title: "Nighttime Base-load Phantom Draw Anomaly",
      target: "Verdant Academic Quad (Floors 2 & 3)",
      confidence: "89% Deviation Certainty",
      impact: "Est. $195/mo savings & 620 kg CO2 reduction",
      summary:
        "Building power draw did not return to sleep baseline between 1:00 AM and 4:00 AM. 44 desktop workstations and localized zone heaters identified as active in unoccupied laboratory spaces.",
      category: "Surge Anomaly",
      status: "Investigation Queued",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <Gauge className="h-5 w-5 text-emerald-400" />
            Predictive Energy & Load Shifting Telemetry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical anomaly detection, peak-shaving recommendations, and automated HVAC schedule offsets
          </p>
        </div>

        <Button variant="eco" size="sm" className="gap-1.5 text-xs">
          <Activity className="h-3.5 w-3.5" />
          Run Telemetry Analysis
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {insights.map((item) => (
          <Card key={item.id} className="border-slate-800 bg-[#0F1626]">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400" />
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400 mt-0.5">
                    Target: {item.target} • {item.category}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-800 text-slate-300 text-[11px] font-medium px-2 py-0.5 border border-slate-700">
                    {item.confidence}
                  </span>
                  <span className="rounded bg-emerald-950/60 text-emerald-300 text-[11px] font-medium px-2 py-0.5 border border-emerald-800/40">
                    {item.impact}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <p className="text-xs text-slate-300 leading-relaxed bg-[#090D16] p-3 rounded-md border border-slate-800">
                {item.summary}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400">
                  Status: <strong className="text-slate-200">{item.status}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-8 border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300">
                    Dismiss
                  </Button>
                  <Button variant="eco" size="sm" className="text-xs h-8 gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    Authorize Setback Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
