"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import {
  Calendar,
  PlusCircle,
  Clock,
  MapPin,
  Users,
  Award,
  Trash2,
  CheckCircle2,
  Sparkles,
  Send,
} from "lucide-react";

export default function FacultyEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("WORKSHOP");
  const [formLocation, setFormLocation] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formDuration, setFormDuration] = useState("120");
  const [formEcoPoints, setFormEcoPoints] = useState("100");
  const [formCapacity, setFormCapacity] = useState("50");
  const [formDescription, setFormDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/faculty/events");
      const data = await res.json();
      if (data.success && data.events) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error("Fetch faculty events error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formLocation || !formDate || !formDescription) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/faculty/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          category: formCategory,
          location: formLocation,
          eventDate: formDate,
          durationMinutes: formDuration,
          ecoPoints: formEcoPoints,
          capacity: formCapacity,
          description: formDescription,
          organizer: "Dept of Renewable Energy & Faculty Council",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage(data.message);
        setTimeout(() => setToastMessage(""), 3500);
        setShowCreateModal(false);
        setFormTitle("");
        setFormDescription("");
        setFormLocation("");
        fetchEvents();
      }
    } catch (err) {
      console.error("Create event error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to cancel this event?")) return;

    try {
      const res = await fetch(`/api/faculty/events?id=${eventId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage("Event cancelled.");
        setTimeout(() => setToastMessage(""), 3000);
        fetchEvents();
      }
    } catch (err) {
      console.error("Delete event error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="FACULTY" size="sm" />
            <span className="text-xs text-purple-400 font-semibold bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30">
              Campus Sustainability Mobilization
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Event Management & Publishing Hub
            <Calendar className="h-5 w-5 text-purple-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Publish green drives, seminars, tree planting workshops & manage student registrations
          </p>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          variant="eco"
          size="sm"
          className="gap-2 shadow-lg shadow-emerald-600/20"
        >
          <PlusCircle className="h-4 w-4" />
          Publish New Green Event
        </Button>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold text-center shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* Events Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading faculty events...</div>
      ) : events.length === 0 ? (
        <Card className="glass-card text-center p-8">
          <Calendar className="h-8 w-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No Active Events</p>
          <p className="text-xs text-slate-400 mt-1">Publish your first campus sustainability drive!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => (
            <Card key={evt.id} className="glass-card flex flex-col justify-between hover:border-purple-500/40 transition">
              <div>
                <CardHeader className="pb-3 border-b border-slate-800">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider mb-2 inline-block">
                        {evt.category.replace("_", " ")}
                      </span>
                      <CardTitle className="text-base font-bold text-white">{evt.title}</CardTitle>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-extrabold text-emerald-300">
                      <Award className="h-3.5 w-3.5" />
                      +{evt.ecoPoints} PTS
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-3">
                  <p className="text-xs text-slate-300">{evt.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <span>{new Date(evt.eventDate).toLocaleDateString()}</span>
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
                      <Users className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-emerald-300">
                        {evt.registeredCount} / {evt.capacity} Registered Students
                      </span>
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-950/40 rounded-b-xl flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Organizer: {evt.organizer}</span>
                <Button
                  onClick={() => handleDeleteEvent(evt.id)}
                  variant="outline"
                  size="sm"
                  className="text-xs text-rose-400 border-rose-500/30 hover:bg-rose-950/40 gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Cancel Event
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-card border border-purple-500/40 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Publish Campus Sustainability Event
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Green Campus Microgrid Workshop 2026"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="WORKSHOP">Workshop / Seminar</option>
                    <option value="TREE_PLANTING">Tree Planting Drive</option>
                    <option value="CLEANUP_DRIVE">E-Waste / Waste Drive</option>
                    <option value="HACKATHON">Clean-Tech Hackathon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Eco-Points Reward</label>
                  <input
                    type="number"
                    value={formEcoPoints}
                    onChange={(e) => setFormEcoPoints(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location Details *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Complex Auditorium B"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Event agenda, requirements, and sustainability goals..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" variant="eco" disabled={submitting} className="text-xs gap-1.5">
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? "Publishing..." : "Publish Event"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
