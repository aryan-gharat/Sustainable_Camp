# GreenCampus AI 🌿
### Autonomous Sustainable Campus Management & Decarbonization System

[![Next.js 15](https://img.shields.io/badge/Next.js-15.2.1-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-1B222D?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![JWT Auth](https://img.shields.io/badge/Auth-JWT_%2B_Jose-000000?logo=json-web-tokens)](https://github.com/panva/jose)

---

## 🏛️ System Overview

**GreenCampus AI** is an enterprise-grade Sustainable Campus Management System designed to orchestrate energy optimization, IoT sub-meter telemetry, rainwater harvesting, smart classroom setback automation, and student sustainability gamification across university campuses.

Built from the ground up on **Next.js 15 (App Router)** with **TypeScript**, **PostgreSQL**, **Prisma ORM**, and an Edge-compatible **JWT Role-Based Access Control (RBAC)** architecture.

---

## 👥 Role-Based Access Control (RBAC) Architecture

GreenCampus AI provides segregated operational workspaces and route protection for four core campus roles:

| Role | Target Route Prefix | Core Capabilities & Responsibilities | Default Test Account |
| :--- | :--- | :--- | :--- |
| **Admin** | `/admin/*` | Campus-wide microgrid telemetry, ESG compliance, building registries, AI anomaly validation, user provisioning | `admin@greencampus.ai` |
| **Faculty** | `/faculty/*` | Smart classroom HVAC setback scheduling, lab energy intensity index, green research grants, academic reports | `faculty@greencampus.ai` |
| **Student** | `/student/*` | Personal carbon footprint, dorm sustainability cup standings, green quests, redeemable eco-points | `student@greencampus.ai` |
| **Maintenance**| `/maintenance/*` | Urgent work orders, acoustic ultrasonic water leak radar, IoT equipment calibration, preventive rosters | `maintenance@greencampus.ai` |

*Password for all default demo accounts:* **`green2026!`**

---

## 📂 Production Folder Structure

```
Sustainable_Project/
├── .env                              # Environment configurations (PostgreSQL, JWT Secret, App URL)
├── .env.example                      # Production template for environment setup
├── package.json                      # Dependencies and scripts (Next.js 15, Prisma, Tailwind, Jose)
├── tsconfig.json                     # Strict TypeScript configuration with @/* path aliases
├── tailwind.config.ts                # Custom sustainability color palette & Shadcn animation tokens
├── postcss.config.mjs                # PostCSS autoprefixer & Tailwind pipeline
├── next.config.ts                    # Next.js 15 runtime options
├── prisma/
│   ├── schema.prisma                 # Production PostgreSQL schema (13 models, 8 enums)
│   ├── seed.js                       # Comprehensive database seeder (Users, Buildings, Meters, Quests, Work Orders)
│   └── seed.ts                       # TypeScript database seeder source
└── src/
    ├── middleware.ts                 # Edge-runtime JWT validation and RBAC route guard
    ├── types/
    │   ├── auth.ts                   # Role, JWTPayload, SessionUser, RoleConfig types
    │   └── dashboard.ts              # NavItem, MetricCardProps, QuickAction types
    ├── lib/
    │   ├── prisma.ts                 # PrismaClient singleton with hot-reload caching
    │   ├── jwt.ts                    # Edge-compatible Jose JWT signing & verification
    │   ├── auth.ts                   # Password hashing, Next.js 15 async cookies & session helpers
    │   ├── rbac.ts                   # RBAC permission matrix and role navigation mapping
    │   └── utils.ts                  # Class merger (cn) and number/date formatters
    ├── components/
    │   ├── ui/                       # Shadcn UI primitives
    │   │   ├── button.tsx            # Eco, gradient, and standard button variants
    │   │   ├── card.tsx              # Glassmorphic container cards
    │   │   ├── badge.tsx             # Role & category colored status badges
    │   │   ├── input.tsx             # Form input fields
    │   │   └── role-guard.tsx        # Client-side RBAC conditional component
    │   ├── auth/                     # Authentication components
    │   │   ├── LoginForm.tsx         # Manual login + 1-Click Role Quick Switcher
    │   │   └── RegisterForm.tsx      # Multi-role campus registration
    │   └── dashboard/                # Common dashboard layout components
    │       ├── Sidebar.tsx           # Role-specific collapsible sidebar with active indicators
    │       ├── Topbar.tsx            # Header with role title, alerts, and quick switcher
    │       ├── QuickRoleSwitcher.tsx # Interactive topbar RBAC role simulator
    │       ├── CampusLiveTicker.tsx  # Glowing live IoT campus telemetry ticker
    │       ├── RoleBadge.tsx         # Custom color-coded role badge
    │       └── MetricCard.tsx        # Dynamic telemetry metric cards with trends
    └── app/
        ├── layout.tsx                # Root layout (Dark theme, typography, SEO metadata)
        ├── page.tsx                  # Futuristic GreenCampus AI landing portal
        ├── globals.css               # Modern glassmorphism & sustainability styling
        ├── api/                      # REST & Auth API endpoints
        │   ├── auth/
        │   │   ├── login/route.ts    # Database + 1-Click demo authentication
        │   │   ├── register/route.ts # Registration, password hashing & profile creation
        │   │   ├── me/route.ts       # Active session inspection
        │   │   └── logout/route.ts   # Cookie invalidation
        │   └── health/route.ts       # Service health and database diagnostic check
        ├── (auth)/                   # Authentication Route Group
        │   ├── login/page.tsx        # Split-screen login portal
        │   └── register/page.tsx     # Role-based campus registration portal
        └── (dashboard)/              # Role-Protected Dashboard Route Group
            ├── admin/                # Administrator Consoles
            │   ├── layout.tsx        # Dedicated Admin Layout
            │   ├── dashboard/page.tsx# Executive sustainability overview
            │   ├── analytics/page.tsx# Time-series telemetry charts & CSV exports
            │   ├── buildings/page.tsx# Smart infrastructure & LEED directory
            │   ├── users/page.tsx    # Campus personnel RBAC administration
            │   ├── ai-insights/page.tsx # Autonomous AI recommendations & anomaly alerts
            │   └── settings/page.tsx # Telemetry thresholds & alert sensitivity
            ├── student/              # Student Hub
            │   ├── layout.tsx        # Dedicated Student Layout
            │   ├── dashboard/page.tsx# Personal eco-command center
            │   ├── eco-points/page.tsx# Rewards vault & voucher redemption
            │   ├── challenges/page.tsx# Active campus green quests
            │   ├── leaderboard/page.tsx # Residence hall eco cup standings
            │   └── report-issue/page.tsx# Report leaks or energy waste
            ├── faculty/              # Faculty & Research Center
            │   ├── layout.tsx        # Dedicated Faculty Layout
            │   ├── dashboard/page.tsx# Departmental sustainability index
            │   ├── classroom-energy/page.tsx # Smart lecture hall HVAC setbacks
            │   ├── research/page.tsx # Laboratory equipment efficiency & fume hoods
            │   ├── grants/page.tsx   # Clean-tech research grant proposals
            │   └── reports/page.tsx  # Academic ESG curriculum audit exports
            └── maintenance/          # Facilities & Operations
                ├── layout.tsx        # Dedicated Maintenance Layout
                ├── dashboard/page.tsx# Facilities dispatch operations console
                ├── work-orders/page.tsx # Prioritized repair queue & ticket resolve
                ├── equipment/page.tsx# IoT sensor health & inverter status
                ├── leak-alerts/page.tsx # Ultrasonic pipe leak radar
                └── schedule/page.tsx # Preventative servicing calendar
```

---

## 🗄️ Database Schema & Prisma Models

The PostgreSQL database schema in `prisma/schema.prisma` models complete smart campus operations:

- **Identity & RBAC:** `User`, `Profile`, `AuditLog`, `Role` (STUDENT, FACULTY, ADMIN, MAINTENANCE_STAFF)
- **Infrastructure:** `Building`, `Room`, `BuildingCategory` (ACADEMIC, DORMITORY, LABORATORY, LIBRARY, etc.)
- **IoT Resource Monitoring:** `UtilityMeter`, `MeterReading`, `SolarGenerationLog`, `MeterType` (ELECTRICITY, WATER, GAS, SOLAR_PV)
- **Water & Waste:** `WaterStorageTank`, `WasteBin`, `WasteLog`, `WasteCategory` (ORGANIC_COMPOST, PLASTIC_RECYCLING, etc.)
- **Work Orders:** `WorkOrder`, `WorkOrderCategory`, `Priority`, `WorkOrderStatus`
- **Gamification:** `GreenQuest`, `QuestCompletion`, `EcoPointLog`
- **AI Engine:** `AIInsight`, `AnomalyAlert`, `AIInsightStatus`

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or 20.x or 22.x
- PostgreSQL database (optional for demo evaluation, local credentials fallback included)

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Database Setup (When PostgreSQL is running)
```bash
# Push schema to PostgreSQL
npm run prisma:push

# Seed initial campus buildings, meters, quests, and default users
npm run prisma:seed
```

### 5. Launch Development Server
```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔐 Instant Role Evaluation & Demo Switching

To make evaluating the **Role-Based Access Control** and **Dashboard Layouts** seamless:
1. Navigate to `/login` or click **"Portal Sign In"** on the home page.
2. Under the form, click any of the **1-Click Role Quick Login** presets:
   - **Administrator:** `admin@greencampus.ai`
   - **Faculty:** `faculty@greencampus.ai`
   - **Student:** `student@greencampus.ai`
   - **Maintenance:** `maintenance@greencampus.ai`
3. Inside any dashboard, open the **"Viewing as: [Role]"** dropdown in the top header to instantly switch between all 4 dashboards!
