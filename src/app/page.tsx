"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CampusLiveTicker } from "@/components/dashboard/CampusLiveTicker";
import { AISustainabilityAdvisor } from "@/components/ai/AISustainabilityAdvisor";
import {
  Leaf,
  Shield,
  GraduationCap,
  School,
  Wrench,
  Zap,
  Droplets,
  Recycle,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Users,
  Building2,
  BarChart3,
  Mail,
  Send,
  Activity,
  Cpu,
  Clock,
  ChevronRight,
  Gauge,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactRole, setContactRole] = useState("ADMIN");
  const [contactTopic, setContactTopic] = useState("DEMO_REQUEST");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setContactSubmitted(false);
    }, 4000);
  };

  const roleConsoles = [
    {
      role: "Admin",
      title: "Campus Administrator",
      description: "Executive facilities governance, utility limits, department carbon caps & report approval queues.",
      icon: Shield,
      href: "/admin/dashboard",
      badge: "Executive Governance",
    },
    {
      role: "Faculty",
      title: "Faculty & Researcher",
      description: "Department utility analytics, classroom occupancy setbacks, lab equipment metering & research grants.",
      icon: School,
      href: "/faculty/dashboard",
      badge: "Academic Operations",
    },
    {
      role: "Student",
      title: "Student Representative",
      description: "Dorm eco cup challenges, carbon footprint tracking, campus sustainability drives & rewards catalog.",
      icon: GraduationCap,
      href: "/student/dashboard",
      badge: "Student Engagement",
    },
    {
      role: "Maintenance",
      title: "Facilities Specialist",
      description: "Sub-basement acoustic leak radar, prioritized HVAC work orders, solar inverter status & dispatch logs.",
      icon: Wrench,
      href: "/maintenance/dashboard",
      badge: "Field Work Orders",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Microgrid & Substation Telemetry",
      description: "Direct telemetry from 11kV campus substations, rooftop solar PV arrays, and battery energy storage peak shaving.",
    },
    {
      icon: Droplets,
      title: "Acoustic Water Leak Radar",
      description: "Sub-basement acoustic ultrasonic sensors detecting micro-fissure water loss before slab or structural damage occurs.",
    },
    {
      icon: Recycle,
      title: "Solid Waste & Composting Audit",
      description: "Dining hall organic vermicomposting metrics, single-use container reduction, and campus e-waste recycling logs.",
    },
    {
      icon: Gauge,
      title: "HVAC Load Shifting & Setbacks",
      description: "Automated temperature setbacks during unoccupied lecture hall hours and chilled water plant COP tracking.",
    },
    {
      icon: Trophy,
      title: "Dormitory Conservation Cups",
      description: "Granular sub-metering per dormitory cluster with verified energy reductions and semester eco-leaderboards.",
    },
    {
      icon: Shield,
      title: "Verified Audit & Governance",
      description: "Closed-loop incident reporting: student report → administrative approval → maintenance work order → verified resolution.",
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Elena Vance",
      role: "Director of Campus Sustainability",
      dept: "Division of Physical Plant & Facilities",
      bio: "Leads campus Net-Zero 2030 decarbonization roadmap and institutional utility capital planning.",
    },
    {
      name: "Prof. Marcus Thorne",
      role: "Principal Investigator, Smart Grids",
      dept: "Department of Electrical & Energy Engineering",
      bio: "Oversees research microgrid integration, solar PV inverter telemetry, and peak demand reduction.",
    },
    {
      name: "Aiden Sharma",
      role: "Campus Sustainability Representative",
      dept: "Student Environmental Council",
      bio: "Coordinates zero-waste dining hall initiatives and inter-dorm energy conservation challenges.",
    },
    {
      name: "Carlos Mendez",
      role: "Chief Facilities Engineer",
      dept: "Campus Central Utility Plant",
      bio: "Directs chilled water operations, acoustic leak detection networks, and preventive maintenance dispatches.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-emerald-600/30 selection:text-emerald-200">
      {/* Top Live Telemetry SCADA Bar */}
      <CampusLiveTicker />

      {/* Main Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0C1220]/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-14 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-white border border-emerald-500/30">
              <Leaf className="h-4 w-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-slate-100">GreenCampus</span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-300 border border-slate-700">
                  BMS
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Facilities & Energy Operations</p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#consoles" className="hover:text-emerald-400 transition">Consoles</a>
            <a href="#features" className="hover:text-emerald-400 transition">Systems</a>
            <a href="#impact" className="hover:text-emerald-400 transition">Impact Telemetry</a>
            <a href="#scorecard" className="hover:text-emerald-400 transition">LEED Scorecard</a>
            <a href="#team" className="hover:text-emerald-400 transition">Operations Team</a>
            <a href="#contact" className="hover:text-emerald-400 transition">Inquiries</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link href="/login">
              <Button variant="outline" size="sm" className="text-xs h-8 border-slate-700 bg-[#0F1626] hover:bg-slate-800 text-slate-200">
                Portal Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="eco" size="sm" className="text-xs h-8 gap-1.5">
                Register Access
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-20">
        {/* 1. Hero Section */}
        <section id="hero" className="pt-16 pb-12 px-6 border-b border-slate-800/80 bg-[#0A0F1A]">
          <div className="container mx-auto max-w-5xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#0F1626] px-3.5 py-1 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="font-medium text-[11px] tracking-wide uppercase">
                Institutional Energy Management • Division of Physical Plant
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-100 leading-tight">
              Campus Energy Telemetry & Building Operations Console
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              GreenCampus centralizes real-time power substation feeds, rooftop solar PV curves, acoustic water leak sensors, and student conservation initiatives under hardened role-based governance.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/login">
                <Button variant="eco" size="lg" className="gap-2 text-xs">
                  Sign In to Operations
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <a href="#scorecard">
                <Button variant="outline" size="lg" className="text-xs gap-2 border-slate-700 bg-[#0F1626] hover:bg-slate-800 text-slate-200">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  View Campus Scorecard
                </Button>
              </a>
            </div>

            {/* Role Consoles Grid */}
            <div id="consoles" className="pt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-left">
              {roleConsoles.map((rc) => {
                const Icon = rc.icon;
                return (
                  <Link href={`/login?redirect=${rc.href}`} key={rc.role} className="group">
                    <div className="rounded-lg border border-slate-800 bg-[#0F1626] p-4 transition hover:border-slate-700 hover:bg-[#131D33] h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-[10px] font-medium tracking-wider px-2 py-0.5 rounded bg-[#090D16] border border-slate-800 text-slate-400 uppercase">
                            {rc.role}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-100 text-xs group-hover:text-emerald-400 transition">
                          {rc.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                          {rc.description}
                        </p>
                      </div>
                      <div className="pt-3 text-[11px] font-medium text-slate-400 flex items-center justify-between border-t border-slate-800/80 mt-3 group-hover:text-slate-200">
                        <span>Access Console</span>
                        <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. Systems & Hardware Features */}
        <section id="features" className="py-12 px-6">
          <div className="container mx-auto max-w-6xl space-y-10">
            <div className="text-center space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                Core Systems
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                Integrated Facilities & Telemetry Infrastructure
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Comprehensive SCADA sub-metering, physical plant diagnostic alerts, and multi-department accountability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-lg border border-slate-800 bg-[#0F1626] hover:border-slate-700 transition"
                  >
                    <div className="p-2 rounded-md bg-slate-800 border border-slate-700 w-fit text-emerald-400 mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-100 mb-1.5">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. Impact Telemetry */}
        <section id="impact" className="py-12 px-6 border-t border-slate-800/80 bg-[#0A0F1A]">
          <div className="container mx-auto max-w-6xl space-y-10">
            <div className="text-center space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Operational Telemetry
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                Current Semester Performance Indicators
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Aggregated empirical savings recorded by sub-meters and utility bills across campus.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-lg border border-slate-800 bg-[#0F1626] text-center space-y-1.5">
                <div className="p-2 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 w-fit mx-auto mb-2">
                  <Leaf className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-slate-100 tabular-nums">
                  142.8 <span className="text-xs font-semibold text-slate-400">Tonnes</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-300">Annual Carbon Offset</h4>
                <p className="text-[11px] text-slate-400">Net-Zero reduction trajectory</p>
              </div>

              <div className="p-5 rounded-lg border border-slate-800 bg-[#0F1626] text-center space-y-1.5">
                <div className="p-2 rounded-md bg-sky-950/40 border border-sky-800/40 text-sky-400 w-fit mx-auto mb-2">
                  <Droplets className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-slate-100 tabular-nums">
                  125,000 <span className="text-xs font-semibold text-slate-400">Liters</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-300">Rainwater Recaptured</h4>
                <p className="text-[11px] text-slate-400">Used for grounds irrigation</p>
              </div>

              <div className="p-5 rounded-lg border border-slate-800 bg-[#0F1626] text-center space-y-1.5">
                <div className="p-2 rounded-md bg-slate-800 border border-slate-700 text-slate-300 w-fit mx-auto mb-2">
                  <Recycle className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-slate-100 tabular-nums">
                  86.2%
                </div>
                <h4 className="text-xs font-semibold text-slate-300">Landfill Diversion Rate</h4>
                <p className="text-[11px] text-slate-400">Dining organics & composting</p>
              </div>

              <div className="p-5 rounded-lg border border-slate-800 bg-[#0F1626] text-center space-y-1.5">
                <div className="p-2 rounded-md bg-amber-950/40 border border-amber-800/40 text-amber-400 w-fit mx-auto mb-2">
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-slate-100 tabular-nums">
                  4,820 <span className="text-xs font-semibold text-slate-400">PTS</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-300">Leading Dorm Score</h4>
                <p className="text-[11px] text-slate-400">North Residential Quad</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. LEED Performance Scorecard */}
        <section id="scorecard" className="py-12 px-6 border-t border-slate-800/80">
          <div className="container mx-auto max-w-4xl space-y-6">
            <div className="text-center space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                Institutional Benchmark
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                Campus Sustainability Scorecard
              </h2>
            </div>

            <div className="p-6 rounded-lg border border-slate-800 bg-[#0F1626] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
                    Overall Institutional Score
                  </span>
                  <div className="text-4xl font-bold text-slate-100 mt-1 tabular-nums">
                    94 <span className="text-lg text-slate-400 font-normal">/ 100</span>
                  </div>
                  <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> LEED Platinum Status Maintained
                  </p>
                </div>

                <Link href="/admin/analytics">
                  <Button variant="outline" size="sm" className="text-xs gap-1.5 border-slate-700 bg-[#090D16] hover:bg-slate-800 text-slate-200">
                    <BarChart3 className="h-4 w-4" />
                    Open Telemetry Analytics
                  </Button>
                </Link>
              </div>

              {/* Breakdown Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1.5 p-3 rounded bg-[#090D16] border border-slate-800">
                  <div className="flex justify-between font-medium text-slate-200">
                    <span>Energy Efficiency & Solar Offsets</span>
                    <span className="text-slate-300 font-semibold tabular-nums">96 / 100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[96%]" />
                  </div>
                </div>

                <div className="space-y-1.5 p-3 rounded bg-[#090D16] border border-slate-800">
                  <div className="flex justify-between font-medium text-slate-200">
                    <span>Waste Diversion & Organic Composting</span>
                    <span className="text-slate-300 font-semibold tabular-nums">95 / 100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[95%]" />
                  </div>
                </div>

                <div className="space-y-1.5 p-3 rounded bg-[#090D16] border border-slate-800">
                  <div className="flex justify-between font-medium text-slate-200">
                    <span>Student Conservation Initiatives</span>
                    <span className="text-slate-300 font-semibold tabular-nums">98 / 100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[98%]" />
                  </div>
                </div>

                <div className="space-y-1.5 p-3 rounded bg-[#090D16] border border-slate-800">
                  <div className="flex justify-between font-medium text-slate-200">
                    <span>Water Conservation & Cistern Reserve</span>
                    <span className="text-slate-300 font-semibold tabular-nums">88 / 100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-sky-500 h-full w-[88%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Team Leadership */}
        <section id="team" className="py-12 px-6 border-t border-slate-800/80 bg-[#0A0F1A]">
          <div className="container mx-auto max-w-6xl space-y-10">
            <div className="text-center space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Governance & Operations
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                Operations Management Team
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-slate-800 bg-[#0F1626] space-y-3"
                >
                  <div className="h-10 w-10 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-sm">
                    {member.name.split(" ").slice(-1)[0].charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-xs">{member.name}</h4>
                    <p className="text-[11px] text-emerald-400">{member.role}</p>
                    <p className="text-[10px] text-slate-400">{member.dept}</p>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Contact / Inquiry */}
        <section id="contact" className="py-12 px-6 border-t border-slate-800/80">
          <div className="container mx-auto max-w-3xl space-y-6">
            <div className="text-center space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                Facility Inquiries
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                Inquiries & System Access
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Contact the campus facilities team regarding sub-meter installations or department audits.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-slate-800 bg-[#0F1626]">
              {contactSubmitted ? (
                <div className="p-6 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                  <h3 className="text-sm font-semibold text-slate-100">Inquiry Received</h3>
                  <p className="text-xs text-slate-400">The sustainability desk has logged your request and will follow up.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Jane Smith"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-[#090D16] border border-slate-800 rounded-md p-2.5 text-slate-100 focus:border-slate-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Campus Email</label>
                      <input
                        type="email"
                        required
                        placeholder="j.smith@university.edu"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-[#090D16] border border-slate-800 rounded-md p-2.5 text-slate-100 focus:border-slate-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Designation</label>
                      <select
                        value={contactRole}
                        onChange={(e) => setContactRole(e.target.value)}
                        className="w-full bg-[#090D16] border border-slate-800 rounded-md p-2.5 text-slate-100 focus:border-slate-600 focus:outline-none"
                      >
                        <option value="ADMIN">University Administration</option>
                        <option value="FACULTY">Faculty / Department Chair</option>
                        <option value="STUDENT">Student Leadership</option>
                        <option value="MAINTENANCE">Facilities Engineering</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Topic</label>
                      <select
                        value={contactTopic}
                        onChange={(e) => setContactTopic(e.target.value)}
                        className="w-full bg-[#090D16] border border-slate-800 rounded-md p-2.5 text-slate-100 focus:border-slate-600 focus:outline-none"
                      >
                        <option value="DEMO_REQUEST">Console Demonstration</option>
                        <option value="PARTNERSHIP">Hardware Sub-metering Integration</option>
                        <option value="API_INTEGRATION">LEED Certification Review</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Message</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Specify building identification, target utility, or project scope..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-800 rounded-md p-2.5 text-slate-100 focus:border-slate-600 focus:outline-none"
                    />
                  </div>

                  <Button type="submit" variant="eco" size="lg" className="w-full text-xs font-semibold gap-2">
                    <Send className="h-3.5 w-3.5" />
                    Submit Operations Inquiry
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Sustainability Assistant */}
      <AISustainabilityAdvisor />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#070B13] px-6 py-6 text-xs text-slate-500">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center justify-center">
              <Leaf className="h-3 w-3 fill-current" />
            </div>
            <span className="font-semibold text-slate-300">GreenCampus Facilities</span>
            <span>• Net-Zero Campus Initiative</span>
          </div>

          <p>© 2026 GreenCampus • Division of Facilities & Campus Energy Operations • Authorized Access Only</p>
        </div>
      </footer>
    </div>
  );
}
