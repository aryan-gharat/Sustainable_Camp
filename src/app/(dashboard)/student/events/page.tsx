"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Award,
  CheckCircle2,
  TreePine,
  Filter,
  ArrowRight,
} from "lucide-react";

export default function StudentEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filterCategory !== "ALL") queryParams.append("category", filterCategory);

      const res = await fetch(`/api/student/events?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success && data.events) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filterCategory]);

  const handleAction = async (eventId: string, action: "REGISTER" | "CANCEL" | "CLAIM_POINTS") => {
    try {
      setProcessingId(eventId);
      const res = await fetch("/api/student/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, action }),
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage(data.message);
        setTimeout(() => setToastMessage(""), 3000);
        fetchEvents();
      }
    } catch (err) {
      console.error("Event action error:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "TREE_PLANTING":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "WORKSHOP":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "CLEANUP_DRIVE":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "HACKATHON":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
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
              Campus Action Mobilization
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Campus Sustainability Events
            <Calendar className="h-5 w-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            RSVP for upcoming tree planting drives, zero-waste workshops & hackathons to earn Eco-Points
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center animate-fade-in shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center gap-3 glass-card p-4 rounded-xl border border-slate-800 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Filter className="h-3.5 w-3.5 text-emerald-400" />
          Filter Category:
        </div>
        {["ALL", "TREE_PLANTING", "WORKSHOP", "CLEANUP_DRIVE", "HACKATHON"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filterCategory === cat
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            {cat === "ALL" ? "All Events" : cat.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading campus events...</div>
      ) : events.length === 0 ? (
        <Card className="glass-card text-center p-8">
          <Calendar className="h-8 w-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No Upcoming Events Found</p>
          <p className="text-xs text-slate-400 mt-1">Check back soon for new campus sustainability drives!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => {
            const isPast = new Date(evt.eventDate) < new Date();

            return (
              <Card key={evt.id} className="glass-card flex flex-col justify-between hover:border-emerald-500/30 transition">
                <div>
                  <CardHeader className="pb-3 border-b border-slate-800/60">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider mb-2 ${getCategoryBadge(
                            evt.category
                          )}`}
                        >
                          {evt.category.replace("_", " ")}
                        </span>
                        <CardTitle className="text-base font-bold text-white">{evt.title}</CardTitle>
                        <p className="text-[11px] text-slate-400 mt-0.5">Organized by {evt.organizer}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-extrabold text-emerald-300">
                          <Award className="h-3.5 w-3.5" />
                          +{evt.ecoPoints} PTS
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-3">
                    <p className="text-xs text-slate-300">{evt.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{new Date(evt.eventDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <span>{evt.durationMinutes} mins</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <Users className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                        <span>{evt.registeredCount} / {evt.capacity} Eco-Advocates Registered</span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 border-t border-slate-800/60 bg-slate-950/40 rounded-b-xl flex items-center justify-between">
                  {isPast ? (
                    evt.isRegistered ? (
                      evt.pointsClaimed ? (
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          Attended & +{evt.ecoPoints} PTS Claimed
                        </span>
                      ) : (
                        <Button
                          onClick={() => handleAction(evt.id, "CLAIM_POINTS")}
                          variant="eco"
                          size="sm"
                          disabled={processingId === evt.id}
                          className="w-full text-xs gap-1"
                        >
                          <Award className="h-3.5 w-3.5 text-emerald-400" />
                          {processingId === evt.id ? "Processing..." : `Claim +${evt.ecoPoints} PTS for Attendance`}
                        </Button>
                      )
                    ) : (
                      <span className="text-xs text-slate-400 italic">Event Completed</span>
                    )
                  ) : evt.isRegistered ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Registered for Event
                      </span>
                      <Button
                        onClick={() => handleAction(evt.id, "CANCEL")}
                        variant="outline"
                        size="sm"
                        disabled={processingId === evt.id}
                        className="text-xs text-rose-400 hover:bg-rose-950/40 border-rose-500/30"
                      >
                        Cancel RSVP
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleAction(evt.id, "REGISTER")}
                      variant="eco"
                      size="sm"
                      disabled={processingId === evt.id || evt.registeredCount >= evt.capacity}
                      className="w-full text-xs gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {processingId === evt.id ? "Registering..." : "RSVP & Reserve Spot"}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
