import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, X, ShieldAlert, Cpu, ArrowRight } from "lucide-react";

export default function AdminAIInsightsPage() {
  const insights = [
    {
      id: "ai-01",
      title: "Solar Peak Shifting Opportunity",
      target: "Science Complex & Campus Shuttle Fleet",
      confidence: "94% Neural Confidence",
      impact: "Projected $480/month savings & 1.85 MT CO2 reduction",
      summary:
        "Excess rooftop generation (420 kW) detected during midday hours. AI model recommends pre-cooling lecture halls and directing charging stations to absorb peak production without backfeeding the municipal grid at discounted rates.",
      category: "Energy Optimization",
      status: "Awaiting Confirmation",
    },
    {
      id: "ai-02",
      title: "Nighttime Base-load Phantom Power Anomaly",
      target: "Verdant Academic Quad (Floors 2 & 3)",
      confidence: "89% Anomaly Certainty",
      impact: "Projected $195/month savings & 620 kg CO2 reduction",
      summary:
        "Building power draw did not return to sleep baseline between 1:00 AM and 4:00 AM. 44 desktop workstations and localized zone heaters identified as active in unoccupied rooms.",
      category: "Surge Anomaly",
      status: "Investigation Dispatched",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            Autonomous AI Sustainability Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Machine learning anomaly detection, predictive load shifting, and decarbonization advice
          </p>
        </div>

        <Button variant="eco" size="sm" className="gap-1.5 text-xs">
          <Cpu className="h-3.5 w-3.5" />
          Run Predictive Model
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {insights.map((item) => (
          <Card key={item.id} className="glass-card border-purple-500/20">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Target: {item.target} • {item.category}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-purple-500/20 text-purple-300 text-[11px] font-semibold px-2 py-0.5 border border-purple-500/30">
                    {item.confidence}
                  </span>
                  <span className="rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold px-2 py-0.5 border border-emerald-500/30">
                    {item.impact}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                {item.summary}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400">
                  Status: <strong className="text-white">{item.status}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    Dismiss
                  </Button>
                  <Button variant="eco" size="sm" className="text-xs h-8 gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    Authorize Autonomous Action
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
