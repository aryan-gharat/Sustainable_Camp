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
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Users,
  Building2,
  BarChart3,
  Mail,
  Send,
  MessageSquare,
  Globe,
  Award,
  TrendingUp,
  TrendingDown,
  ChevronRight,
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
      description: "Executive ESG governance, real-time microgrid metrics, department energy limits & report approval workflow.",
      icon: Shield,
      href: "/admin/dashboard",
      color: "border-purple-500/40 text-purple-400 bg-purple-950/20 hover:border-purple-400",
      glow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]",
      badge: "Executive Governance",
    },
    {
      role: "Faculty",
      title: "Faculty & Researcher",
      description: "Department analytics, smart classroom occupancy setbacks, lab equipment telemetry & student tracking.",
      icon: School,
      href: "/faculty/dashboard",
      color: "border-blue-500/40 text-blue-400 bg-blue-950/20 hover:border-blue-400",
      glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]",
      badge: "Academic & Research",
    },
    {
      role: "Student",
      title: "Student Eco-Advocate",
      description: "Carbon footprint calculator, green quests, dorm eco cup leaderboard, campus events & rewards marketplace.",
      icon: GraduationCap,
      href: "/student/dashboard",
      color: "border-emerald-500/40 text-emerald-400 bg-emerald-950/20 hover:border-emerald-400",
      glow: "hover:shadow-[0_0_30px_rgba(34,197,94,0.25)]",
      badge: "Gamification & Quests",
    },
    {
      role: "Maintenance",
      title: "Facilities Engineer",
      description: "Acoustic water leak radar, prioritized HVAC work orders, solar inverter telemetry & student resolution notices.",
      icon: Wrench,
      href: "/maintenance/dashboard",
      color: "border-amber-500/40 text-amber-400 bg-amber-950/20 hover:border-amber-400",
      glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]",
      badge: "IoT & Maintenance Work Orders",
    },
  ];

  const features = [
    {
      icon: Zap,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      title: "Microgrid IoT Telemetry",
      description: "Rooftop solar PV array output monitoring, real-time power draw curves, and battery storage balancing.",
    },
    {
      icon: Droplets,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      title: "Acoustic Water Leak Radar",
      description: "Sub-basement acoustic sensors detecting micro-fissure water leaks in real-time before major damage occurs.",
    },
    {
      icon: Recycle,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      title: "Waste Sorting & Diversion",
      description: "Smart organic vermicomposting, single-use plastic elimination, and campus e-waste recyclathons.",
    },
    {
      icon: Sparkles,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      title: "GreenCampus AI Advisor",
      description: "Autonomous decarbonization recommendations, HVAC setback optimization, and interactive chatbot advisor.",
    },
    {
      icon: Trophy,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      title: "Gamified Student Action",
      description: "Green Quests, Eco-Points balance, dorm eco cups, and redeemable campus dining & bookstore vouchers.",
    },
    {
      icon: Shield,
      color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
      title: "5-Stage Workflow Governance",
      description: "Seamless lifecycle: Student creates report → Admin approves → Maintenance assigned → Issue resolved → Student notified.",
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Elena Vance",
      role: "Chief Sustainability Officer & VP",
      dept: "Office of the President & Sustainability Council",
      bio: "Leads university Net-Zero 2030 climate strategy and institutional ESG microgrid governance.",
      avatarBg: "from-purple-500 to-indigo-700",
    },
    {
      name: "Prof. Marcus Thorne",
      role: "Director of Smart Grid Systems",
      dept: "Dept of Renewable Energy & IoT Engineering",
      bio: "Principal Investigator on microgrid IoT telemetry, solar PV peak load shifting, and liquid chiller labs.",
      avatarBg: "from-blue-500 to-cyan-700",
    },
    {
      name: "Aiden Sharma",
      role: "Student Eco-Club Lead",
      dept: "Environmental Engineering '27",
      bio: "Student ambassador spearheading zero-waste dining challenges and sustainable commute streaks.",
      avatarBg: "from-emerald-500 to-teal-700",
    },
    {
      name: "Carlos Mendez",
      role: "Lead Facilities Specialist",
      dept: "Campus Operations & Smart HVAC",
      bio: "Master engineer overseeing acoustic leak sensor radar, HVAC setback automation, and repair dispatches.",
      avatarBg: "from-amber-500 to-orange-700",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Live Telemetry Pulse Bar */}
      <CampusLiveTicker />

      {/* Main Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
              <Leaf className="h-5 w-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white">GreenCampus</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-extrabold uppercase text-emerald-400 border border-emerald-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Sustainable University OS</p>
            </div>
          </Link>

          {/* Quick Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition">Features</a>
            <a href="#impact" className="hover:text-emerald-400 transition">Impact Metrics</a>
            <a href="#score" className="hover:text-emerald-400 transition">Sustainability Score</a>
            <a href="#about" className="hover:text-emerald-400 transition">About Project</a>
            <a href="#team" className="hover:text-emerald-400 transition">Team</a>
            <a href="#contact" className="hover:text-emerald-400 transition">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm" className="text-xs">
                Portal Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="eco" size="sm" className="text-xs gap-1.5 shadow-lg shadow-emerald-600/20">
                Register Account
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="flex-1 space-y-16">
        {/* 1. Hero Section */}
        <section id="hero" className="relative overflow-hidden pt-20 pb-16 px-6">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
          <div className="absolute top-1/3 left-1/4 w-[350px] h-[300px] bg-purple-600/10 blur-3xl pointer-events-none rounded-full" />

          <div className="container mx-auto max-w-5xl text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-4 py-1.5 text-xs text-emerald-300 shadow-sm">
              <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span className="font-semibold">GreenCampus AI 2.0 • Autonomous University Decarbonization OS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Intelligent Campus Decarbonization & ESG Management
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
              <strong>GreenCampus AI</strong> orchestrates real-time microgrid telemetry, rooftop solar PV optimization, acoustic water leak radar, smart classroom HVAC setbacks, and gamified student eco-quests under a hardened Role-Based Access Control architecture.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/login">
                <Button variant="eco" size="lg" className="gap-2 text-sm shadow-xl shadow-emerald-600/30">
                  Launch Consoles
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#score">
                <Button variant="outline" size="lg" className="text-sm gap-2">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  View Live Sustainability Score
                </Button>
              </a>
            </div>

            {/* Role Consoles Grid Preview */}
            <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {roleConsoles.map((rc) => {
                const Icon = rc.icon;
                return (
                  <Link href={`/login?redirect=${rc.href}`} key={rc.role} className="group">
                    <div className={`rounded-xl border p-4 backdrop-blur-md transition-all duration-300 h-full flex flex-col justify-between ${rc.color} ${rc.glow}`}>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Icon className="h-5 w-5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/80 border border-current">
                            {rc.role}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-sm group-hover:text-emerald-300">{rc.title}</h4>
                        <p className="text-[11px] text-slate-300 mt-1 line-clamp-3 leading-relaxed">{rc.description}</p>
                      </div>
                      <div className="pt-3 text-[11px] font-semibold flex items-center justify-between border-t border-slate-800/60 mt-3">
                        <span>Access Console</span>
                        <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. Features Section */}
        <section id="features" className="py-16 px-6 border-t border-slate-800/80 bg-slate-950/60">
          <div className="container mx-auto max-w-6xl space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Core Capabilities</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Enterprise Sustainable Campus Platform Features
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
                Comprehensive hardware telemetry, predictive AI insights, and gamified stakeholder action.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition group">
                    <div className={`p-3 rounded-xl w-fit border mb-4 group-hover:scale-110 transition ${feat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 mb-2">{feat.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{feat.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. Impact Metrics Section */}
        <section id="impact" className="py-16 px-6 border-t border-slate-800/80">
          <div className="container mx-auto max-w-6xl space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Verified Impact</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Real-Time Institutional Impact Metrics
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Empirical environmental savings aggregated across campus buildings, labs, and dorms.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 text-center space-y-2">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mx-auto"><Leaf className="h-6 w-6" /></div>
                <div className="text-3xl font-black text-white">142.8 <span className="text-xs text-emerald-400 font-bold">Tonnes</span></div>
                <h4 className="text-xs font-bold text-slate-300">Annual Carbon Offset</h4>
                <p className="text-[11px] text-slate-400">Equivalent to planting 7,140 mature oak trees</p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-cyan-500/30 text-center space-y-2">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit mx-auto"><Droplets className="h-6 w-6" /></div>
                <div className="text-3xl font-black text-white">125,000 <span className="text-xs text-cyan-400 font-bold">Liters</span></div>
                <h4 className="text-xs font-bold text-slate-300">Water Conserved</h4>
                <p className="text-[11px] text-slate-400">42% supplied via rainwater harvesting</p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-purple-500/30 text-center space-y-2">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit mx-auto"><Recycle className="h-6 w-6" /></div>
                <div className="text-3xl font-black text-white">86.2%</div>
                <h4 className="text-xs font-bold text-slate-300">Landfill Diversion Rate</h4>
                <p className="text-[11px] text-slate-400">Zero-waste dining and organic composting</p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-amber-500/30 text-center space-y-2">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit mx-auto"><Trophy className="h-6 w-6" /></div>
                <div className="text-3xl font-black text-white">4,820 <span className="text-xs text-amber-400 font-bold">PTS</span></div>
                <h4 className="text-xs font-bold text-slate-300">Top Dorm Eco Cup</h4>
                <p className="text-[11px] text-slate-400">EcoLiving Dorm Cluster leadership</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Live Sustainability Score Section */}
        <section id="score" className="py-16 px-6 border-t border-slate-800/80 bg-slate-950/60">
          <div className="container mx-auto max-w-5xl space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">LEED Platinum Index</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Live Campus Sustainability Scorecard
              </h2>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Overall Campus ESG Score</span>
                  <div className="text-5xl font-black text-white mt-1">
                    94 <span className="text-xl text-amber-400 font-bold">/ 100</span>
                  </div>
                  <p className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" /> +4.5 PTS Improvement This Semester (LEED Platinum Rating)
                  </p>
                </div>

                <Link href="/admin/analytics">
                  <Button variant="eco" size="lg" className="gap-2 text-xs shadow-lg shadow-emerald-600/20">
                    <BarChart3 className="h-4 w-4" />
                    Open Recharts Telemetry Dashboard
                  </Button>
                </Link>
              </div>

              {/* Sub-Score Progress Bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex justify-between font-bold text-white">
                    <span>Energy Efficiency & Solar Ratio</span>
                    <span className="text-amber-400">96 / 100</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-400 h-full w-[96%]" />
                  </div>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex justify-between font-bold text-white">
                    <span>Waste Diversion & Composting</span>
                    <span className="text-emerald-400">95 / 100</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[95%]" />
                  </div>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex justify-between font-bold text-white">
                    <span>Student Gamification & Action</span>
                    <span className="text-purple-400">98 / 100</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div className="bg-purple-400 h-full w-[98%]" />
                  </div>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex justify-between font-bold text-white">
                    <span>Water Conservation & Rainwater</span>
                    <span className="text-cyan-400">88 / 100</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div className="bg-cyan-400 h-full w-[88%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. About Project Section */}
        <section id="about" className="py-16 px-6 border-t border-slate-800/80">
          <div className="container mx-auto max-w-5xl space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">University Net-Zero Vision</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                About GreenCampus AI Project
              </h2>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                <strong>GreenCampus AI</strong> is a Next.js 15 enterprise platform engineered to unify university climate action, microgrid hardware telemetry, facilities maintenance, and student gamification under a single intelligent system.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h4 className="font-bold text-white mb-1">Architecture</h4>
                  <p className="text-slate-400">Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Recharts.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h4 className="font-bold text-white mb-1">Database & ORM</h4>
                  <p className="text-slate-400">PostgreSQL Database, Prisma ORM, strict relations & seed workflow.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h4 className="font-bold text-white mb-1">Security & Auth</h4>
                  <p className="text-slate-400">Jose JWT, HTTP-only cookies, Bcrypt password hashing & RBAC Middleware.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Team Section */}
        <section id="team" className="py-16 px-6 border-t border-slate-800/80 bg-slate-950/60">
          <div className="container mx-auto max-w-6xl space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Project Leadership</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Meet the GreenCampus AI Team
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 text-center hover:border-purple-500/40 transition">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-tr ${member.avatarBg} mx-auto flex items-center justify-center font-bold text-white text-xl shadow-lg`}>
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{member.name}</h4>
                    <p className="text-[11px] font-semibold text-emerald-400">{member.role}</p>
                    <p className="text-[10px] text-slate-400">{member.dept}</p>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Contact Section */}
        <section id="contact" className="py-16 px-6 border-t border-slate-800/80">
          <div className="container mx-auto max-w-4xl space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Get In Touch</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                University Partnership & Demo Inquiries
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Contact our sustainability team to deploy GreenCampus AI at your institution.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl">
              {contactSubmitted ? (
                <div className="p-8 text-center space-y-3">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Thank You for Reaching Out!</h3>
                  <p className="text-xs text-slate-300">Our campus sustainability team will contact you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Jane Smith"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-100 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Institutional Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. j.smith@university.edu"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-100 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Your Campus Role</label>
                      <select
                        value={contactRole}
                        onChange={(e) => setContactRole(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-100 focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="ADMIN">University Administrator / Vice Chancellor</option>
                        <option value="FACULTY">Faculty Member / Researcher</option>
                        <option value="STUDENT">Student Representative</option>
                        <option value="MAINTENANCE">Facilities Manager</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Inquiry Topic</label>
                      <select
                        value={contactTopic}
                        onChange={(e) => setContactTopic(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-100 focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="DEMO_REQUEST">Request Live System Demo</option>
                        <option value="PARTNERSHIP">University Partnership</option>
                        <option value="API_INTEGRATION">IoT Hardware Integration</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Message / Project Requirements *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your campus building count, sustainability goals, or Net-Zero timeline..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <Button type="submit" variant="eco" size="lg" className="w-full text-xs font-bold gap-2 py-3 shadow-lg shadow-emerald-600/20">
                    <Send className="h-4 w-4" />
                    Submit Inquiry to Sustainability Team
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Floating AI Sustainability Advisor Chatbot */}
      <AISustainabilityAdvisor />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-8 text-xs text-slate-500">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Leaf className="h-3.5 w-3.5 fill-current" />
            </div>
            <span className="font-bold text-slate-300">GreenCampus AI OS</span>
            <span>• Net-Zero 2030 Campus Initiative</span>
          </div>

          <p>© 2026 GreenCampus AI. Powered by Next.js 15, PostgreSQL, Prisma ORM, Recharts & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
