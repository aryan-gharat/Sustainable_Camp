import fs from "fs";
import path from "path";
import {
  CampusDatabaseSchema,
  User,
  Profile,
  Building,
  UtilityMeter,
  MeterReading,
  WorkOrder,
  StudentReport,
  CampusEvent,
  EventRegistration,
  Reward,
  RewardRedemption,
  EcoPointLog,
  Department,
  CarbonCalculation,
  AuditLog,
  AnomalyAlert,
  AIInsight,
} from "./types";
import { getInitialDatabase } from "./initialData";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE_PATH = path.join(DATA_DIR, "greencampus-db.json");

class PreBackendStore {
  private memoryDb: CampusDatabaseSchema | null = null;
  private isSaving = false;

  constructor() {
    this.ensureDatabaseLoaded();
  }

  private ensureDatabaseLoaded(): CampusDatabaseSchema {
    if (this.memoryDb) {
      return this.memoryDb;
    }

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (!fs.existsSync(DB_FILE_PATH)) {
        const initial = getInitialDatabase();
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initial, null, 2), "utf8");
        this.memoryDb = initial;
        return initial;
      }

      const fileContent = fs.readFileSync(DB_FILE_PATH, "utf8");
      if (!fileContent.trim()) {
        const initial = getInitialDatabase();
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initial, null, 2), "utf8");
        this.memoryDb = initial;
        return initial;
      }

      const parsed: CampusDatabaseSchema = JSON.parse(fileContent);
      // Validate schema has required collections
      if (!Array.isArray(parsed.users) || !Array.isArray(parsed.buildings)) {
        const initial = getInitialDatabase();
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initial, null, 2), "utf8");
        this.memoryDb = initial;
        return initial;
      }

      this.memoryDb = parsed;
      return parsed;
    } catch (err) {
      console.error("[PreBackendStore] Error loading database file, initializing fresh store:", err);
      const initial = getInitialDatabase();
      try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initial, null, 2), "utf8");
      } catch (writeErr) {
        console.error("[PreBackendStore] Error writing initial database file:", writeErr);
      }
      this.memoryDb = initial;
      return initial;
    }
  }

  private persist() {
    if (!this.memoryDb || this.isSaving) return;
    this.isSaving = true;

    try {
      this.memoryDb.lastUpdated = new Date().toISOString();
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.memoryDb, null, 2), "utf8");
    } catch (err) {
      console.error("[PreBackendStore] Failed to write to disk:", err);
    } finally {
      this.isSaving = false;
    }
  }

  public resetDatabase(): CampusDatabaseSchema {
    const initial = getInitialDatabase();
    this.memoryDb = initial;
    this.persist();
    return initial;
  }

  public getRawDb(): CampusDatabaseSchema {
    return this.ensureDatabaseLoaded();
  }

  // ==========================================
  // USERS & PROFILES
  // ==========================================

  public getAllUsers(filter?: { role?: string; search?: string }) {
    const db = this.ensureDatabaseLoaded();
    let result = db.users;

    if (filter?.role && filter.role !== "ALL") {
      result = result.filter((u) => u.role === filter.role);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.department && u.department.toLowerCase().includes(q))
      );
    }

    return result.map((u) => {
      const profile = db.profiles.find((p) => p.userId === u.id);
      return {
        ...u,
        ecoPoints: profile?.totalEcoPoints ?? 0,
        carbonSavedKg: profile?.carbonSavedKg ?? 0,
        waterSavedLiters: profile?.waterSavedLiters ?? 0,
        streakDays: profile?.streakDays ?? 0,
      };
    });
  }

  public getUserById(id: string): (User & { profile?: Profile }) | null {
    const db = this.ensureDatabaseLoaded();
    const user = db.users.find((u) => u.id === id);
    if (!user) return null;
    const profile = db.profiles.find((p) => p.userId === id);
    return { ...user, profile };
  }

  public getUserByEmail(email: string): (User & { profile?: Profile }) | null {
    const db = this.ensureDatabaseLoaded();
    const normalized = email.toLowerCase().trim();
    const user = db.users.find((u) => u.email.toLowerCase().trim() === normalized);
    if (!user) return null;
    const profile = db.profiles.find((p) => p.userId === user.id);
    return { ...user, profile };
  }

  public createUser(userData: {
    email: string;
    name: string;
    passwordHash: string;
    role: any;
    department?: string | null;
    studentId?: string | null;
    staffId?: string | null;
    initialEcoPoints?: number;
  }): User & { profile: Profile } {
    const db = this.ensureDatabaseLoaded();
    const now = new Date().toISOString();
    const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newUser: User = {
      id: userId,
      email: userData.email.toLowerCase().trim(),
      name: userData.name,
      passwordHash: userData.passwordHash,
      role: userData.role,
      department: userData.department || null,
      studentId: userData.studentId || null,
      staffId: userData.staffId || null,
      avatarUrl: null,
      isActive: true,
      lastLoginAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const initialPts =
      typeof userData.initialEcoPoints === "number"
        ? userData.initialEcoPoints
        : userData.role === "STUDENT"
        ? 100
        : 50;

    const newProfile: Profile = {
      id: `prof-${userId}`,
      userId,
      bio: null,
      totalEcoPoints: initialPts,
      carbonSavedKg: 0,
      waterSavedLiters: 0,
      streakDays: 1,
      createdAt: now,
      updatedAt: now,
    };

    db.users.push(newUser);
    db.profiles.push(newProfile);

    // Initial eco-points log
    db.ecoPointLogs.push({
      id: `epl-${Date.now()}`,
      userId,
      points: initialPts,
      reason: "Welcome to GreenCampus AI Grant",
      createdAt: now,
    });

    // Audit log
    db.auditLogs.push({
      id: `aud-${Date.now()}`,
      userId,
      action: "USER_REGISTERED",
      entityType: "User",
      entityId: userId,
      metadata: JSON.stringify({ role: userData.role, email: userData.email }),
      createdAt: now,
    });

    this.persist();
    return { ...newUser, profile: newProfile };
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const db = this.ensureDatabaseLoaded();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    db.users[idx] = {
      ...db.users[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.persist();
    return db.users[idx];
  }

  public deleteUser(id: string): boolean {
    const db = this.ensureDatabaseLoaded();
    const initialLen = db.users.length;
    db.users = db.users.filter((u) => u.id !== id);
    db.profiles = db.profiles.filter((p) => p.userId !== id);
    db.ecoPointLogs = db.ecoPointLogs.filter((l) => l.userId !== id);
    db.studentReports = db.studentReports.filter((r) => r.userId !== id);
    db.eventRegistrations = db.eventRegistrations.filter((er) => er.userId !== id);

    if (db.users.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  public getProfileByUserId(userId: string): Profile | null {
    const db = this.ensureDatabaseLoaded();
    return db.profiles.find((p) => p.userId === userId) || null;
  }

  public updateProfile(userId: string, updates: Partial<Profile>): Profile | null {
    const db = this.ensureDatabaseLoaded();
    let profile = db.profiles.find((p) => p.userId === userId);
    const now = new Date().toISOString();

    if (!profile) {
      profile = {
        id: `prof-${userId}`,
        userId,
        bio: null,
        totalEcoPoints: 50,
        carbonSavedKg: 0,
        waterSavedLiters: 0,
        streakDays: 1,
        createdAt: now,
        updatedAt: now,
      };
      db.profiles.push(profile);
    }

    Object.assign(profile, updates, { updatedAt: now });
    this.persist();
    return profile;
  }

  public adjustEcoPoints(userId: string, deltaPoints: number, reason: string): Profile | null {
    const db = this.ensureDatabaseLoaded();
    let profile = db.profiles.find((p) => p.userId === userId);
    const now = new Date().toISOString();

    if (!profile) {
      profile = {
        id: `prof-${userId}`,
        userId,
        bio: null,
        totalEcoPoints: 0,
        carbonSavedKg: 0,
        waterSavedLiters: 0,
        streakDays: 1,
        createdAt: now,
        updatedAt: now,
      };
      db.profiles.push(profile);
    }

    profile.totalEcoPoints = Math.max(0, profile.totalEcoPoints + deltaPoints);
    profile.updatedAt = now;

    db.ecoPointLogs.push({
      id: `epl-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      points: deltaPoints,
      reason,
      createdAt: now,
    });

    this.persist();
    return profile;
  }

  // ==========================================
  // BUILDINGS & METERS
  // ==========================================

  public getAllBuildings() {
    const db = this.ensureDatabaseLoaded();
    return db.buildings.map((b) => {
      const meters = db.utilityMeters.filter((m) => m.buildingId === b.id);
      const workOrders = db.workOrders.filter((wo) => wo.buildingId === b.id || wo.buildingName === b.name);
      const anomalies = db.anomalyAlerts.filter((a) => a.buildingId === b.id || a.buildingName === b.name);
      return {
        ...b,
        meters,
        workOrders,
        anomalies,
      };
    });
  }

  public getBuildingById(id: string) {
    const db = this.ensureDatabaseLoaded();
    const building = db.buildings.find((b) => b.id === id || b.code === id);
    if (!building) return null;
    const meters = db.utilityMeters.filter((m) => m.buildingId === building.id);
    return { ...building, meters };
  }

  public createBuilding(data: {
    name: string;
    code: string;
    category?: string;
    grossFloorAreaSqM?: number;
    occupancyCapacity?: number;
    solarPanelsInstalled?: boolean;
    rainwaterHarvesting?: boolean;
    currentEnergyRating?: string;
    yearBuilt?: number;
  }): Building & { meters: UtilityMeter[] } {
    const db = this.ensureDatabaseLoaded();
    const now = new Date().toISOString();
    const bldId = `bld-${Date.now()}`;

    const newBuilding: Building = {
      id: bldId,
      name: data.name,
      code: data.code,
      category: data.category || "ACADEMIC",
      grossFloorAreaSqM: Number(data.grossFloorAreaSqM) || 10000,
      yearBuilt: Number(data.yearBuilt) || new Date().getFullYear(),
      occupancyCapacity: Number(data.occupancyCapacity) || 500,
      solarPanelsInstalled: Boolean(data.solarPanelsInstalled),
      rainwaterHarvesting: Boolean(data.rainwaterHarvesting),
      currentEnergyRating: data.currentEnergyRating || "LEED Gold",
      createdAt: now,
      updatedAt: now,
    };

    db.buildings.push(newBuilding);

    // Automatically create primary electricity meter
    const meterId = `m-${Date.now()}`;
    const newMeter: UtilityMeter = {
      id: meterId,
      buildingId: bldId,
      meterType: "ELECTRICITY",
      meterSerial: `MTR-${data.code}-ELEC`,
      locationDescription: "Main Panel Electrical Sub-station",
      unitOfMeasure: "kWh",
      status: "ACTIVE",
      lastTelemetryAt: now,
      createdAt: now,
    };
    db.utilityMeters.push(newMeter);

    // Initial reading
    db.meterReadings.push({
      id: `rd-${Date.now()}`,
      meterId,
      timestamp: now,
      value: 24.5,
      unit: "kW",
      carbonEquivalentKg: 11.0,
    });

    this.persist();
    return { ...newBuilding, meters: [newMeter] };
  }

  public getAllMeters(filter?: { buildingId?: string; meterType?: string }) {
    const db = this.ensureDatabaseLoaded();
    let meters = db.utilityMeters;

    if (filter?.buildingId) {
      meters = meters.filter((m) => m.buildingId === filter.buildingId);
    }
    if (filter?.meterType) {
      meters = meters.filter((m) => m.meterType === filter.meterType);
    }

    return meters.map((m) => {
      const building = db.buildings.find((b) => b.id === m.buildingId);
      const readings = db.meterReadings
        .filter((r) => r.meterId === m.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return {
        ...m,
        building: building || { name: "Campus Infrastructure", code: "GEN" },
        readings,
      };
    });
  }

  // ==========================================
  // STUDENT REPORTS
  // ==========================================

  public getAllReports(filter?: { status?: string; userId?: string }) {
    const db = this.ensureDatabaseLoaded();
    let reports = db.studentReports;

    if (filter?.status && filter.status !== "ALL") {
      reports = reports.filter((r) => r.status === filter.status);
    }
    if (filter?.userId) {
      reports = reports.filter((r) => r.userId === filter.userId);
    }

    // Sort newest first
    reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return reports.map((r) => {
      const user = db.users.find((u) => u.id === r.userId);
      return {
        ...r,
        user: user
          ? { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department }
          : { id: r.userId, name: "Student Eco-Advocate", email: "student@greencampus.ai", role: "STUDENT" },
      };
    });
  }

  public getReportById(id: string) {
    const db = this.ensureDatabaseLoaded();
    const report = db.studentReports.find((r) => r.id === id);
    if (!report) return null;
    const user = db.users.find((u) => u.id === report.userId);
    return {
      ...report,
      user: user
        ? { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department }
        : null,
    };
  }

  public createReport(data: {
    userId: string;
    title: string;
    category: string;
    description: string;
    location: string;
    buildingName?: string | null;
    impactEstKgCo2?: number;
    proofUrl?: string | null;
  }): StudentReport {
    const db = this.ensureDatabaseLoaded();
    const now = new Date().toISOString();
    const id = `rep-${Date.now()}`;

    const newReport: StudentReport = {
      id,
      userId: data.userId,
      title: data.title,
      category: data.category,
      description: data.description,
      location: data.location,
      buildingName: data.buildingName || null,
      impactEstKgCo2: Number(data.impactEstKgCo2) || 15.0,
      proofUrl: data.proofUrl || null,
      status: "PENDING",
      pointsAwarded: 20, // initial reward for submission
      feedback: "Report received and queued for facility inspection. +20 Eco-Points awarded!",
      verifiedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    db.studentReports.unshift(newReport);

    // Award initial 20 eco points
    this.adjustEcoPoints(data.userId, 20, `Submitted sustainability report: ${data.title}`);

    this.persist();
    return newReport;
  }

  public updateReport(
    id: string,
    updates: {
      status?: "PENDING" | "VERIFIED" | "REJECTED" | "RESOLVED";
      pointsAwarded?: number;
      feedback?: string | null;
      dispatchWorkOrder?: boolean;
    }
  ): StudentReport | null {
    const db = this.ensureDatabaseLoaded();
    const idx = db.studentReports.findIndex((r) => r.id === id);
    if (idx === -1) return null;

    const report = db.studentReports[idx];
    const now = new Date().toISOString();

    if (updates.status) report.status = updates.status;
    if (typeof updates.feedback === "string") report.feedback = updates.feedback;
    report.updatedAt = now;

    if (updates.status === "VERIFIED") {
      report.verifiedAt = now;
      const pts = Number(updates.pointsAwarded) || 50;
      report.pointsAwarded = pts;

      // Award verified points
      this.adjustEcoPoints(report.userId, pts, `Verified sustainability report: ${report.title}`);

      // Add carbon credit to student profile
      const prof = db.profiles.find((p) => p.userId === report.userId);
      if (prof) {
        prof.carbonSavedKg += report.impactEstKgCo2 || 10.0;
        prof.updatedAt = now;
      }

      // Auto dispatch work order if requested
      if (updates.dispatchWorkOrder) {
        const woNum = `WO-2026-${Math.floor(100 + Math.random() * 900)}`;
        this.createWorkOrder({
          workOrderNumber: woNum,
          title: `[AUTO-DISPATCH] ${report.title}`,
          description: report.description,
          category: report.category === "WATER_LEAK" ? "PLUMBING_LEAK" : "HVAC_ENERGY",
          priority: "HIGH",
          status: "SUBMITTED",
          locationDetails: report.location,
          buildingName: report.buildingName,
          reportedById: report.userId,
          estimatedCarbonLossKg: report.impactEstKgCo2 || 25.0,
        });
      }
    }

    this.persist();
    return report;
  }

  // ==========================================
  // WORK ORDERS
  // ==========================================

  public getAllWorkOrders(filter?: { status?: string }) {
    const db = this.ensureDatabaseLoaded();
    let list = db.workOrders;

    if (filter?.status && filter.status !== "ALL") {
      list = list.filter((w) => w.status === filter.status);
    }

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return list.map((w) => {
      const reporter = db.users.find((u) => u.id === w.reportedById);
      const assignee = db.users.find((u) => u.id === w.assignedToId);
      const building = db.buildings.find((b) => b.id === w.buildingId || b.name === w.buildingName);

      return {
        ...w,
        reportedBy: reporter
          ? { id: reporter.id, name: reporter.name, email: reporter.email, role: reporter.role }
          : { id: "rep-0", name: "Campus Sensor Alert", email: "telemetry@greencampus.ai", role: "STUDENT" },
        assignedTo: assignee
          ? { id: assignee.id, name: assignee.name, email: assignee.email }
          : { id: "usr-mnt-01", name: "Carlos Mendez (Lead Facilities)" },
        building: building || { name: w.buildingName || "Campus Quad", code: "GEN" },
      };
    });
  }

  public getWorkOrderById(id: string) {
    const db = this.ensureDatabaseLoaded();
    return db.workOrders.find((w) => w.id === id) || null;
  }

  public createWorkOrder(data: {
    workOrderNumber?: string;
    title: string;
    description: string;
    category: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    status?: any;
    locationDetails: string;
    buildingName?: string | null;
    buildingId?: string | null;
    reportedById?: string | null;
    assignedToId?: string | null;
    estimatedCarbonLossKg?: number;
  }): WorkOrder {
    const db = this.ensureDatabaseLoaded();
    const now = new Date().toISOString();
    const id = `wo-${Date.now()}`;
    const workOrderNumber = data.workOrderNumber || `WO-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newWO: WorkOrder = {
      id,
      workOrderNumber,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: data.status || "SUBMITTED",
      locationDetails: data.locationDetails,
      buildingName: data.buildingName || null,
      buildingId: data.buildingId || null,
      reportedById: data.reportedById || null,
      assignedToId: data.assignedToId || "usr-mnt-01",
      estimatedCarbonLossKg: Number(data.estimatedCarbonLossKg) || 25.0,
      resolutionNotes: null,
      resolvedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    db.workOrders.unshift(newWO);
    this.persist();
    return newWO;
  }

  public updateWorkOrder(
    id: string,
    updates: {
      status?: "SUBMITTED" | "ACKNOWLEDGED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";
      resolutionNotes?: string | null;
      actualCarbonSavedKg?: number;
    }
  ): { workOrder: WorkOrder; studentNotice: string } | null {
    const db = this.ensureDatabaseLoaded();
    const idx = db.workOrders.findIndex((w) => w.id === id);
    if (idx === -1) return null;

    const wo = db.workOrders[idx];
    const now = new Date().toISOString();
    let studentNotice = "";

    if (updates.status) wo.status = updates.status;
    if (updates.resolutionNotes) wo.resolutionNotes = updates.resolutionNotes;
    wo.updatedAt = now;

    if (updates.status === "RESOLVED") {
      wo.resolvedAt = now;
      if (!wo.resolutionNotes) {
        wo.resolutionNotes = "Issue inspected, repaired, and verified by Facilities Maintenance Specialist.";
      }

      // If there was a student reporter, notify and award bonus points + carbon saved
      if (wo.reportedById) {
        const reporter = db.users.find((u) => u.id === wo.reportedById);
        studentNotice = `Alert dispatched to ${reporter?.name || "reporting student"}: Issue fully resolved! +30 Eco-Points logged.`;

        const carbonSaved = Number(updates.actualCarbonSavedKg) || wo.estimatedCarbonLossKg || 30.0;
        this.adjustEcoPoints(wo.reportedById, 30, `Hazard Resolved by Maintenance: ${wo.title}`);

        const prof = db.profiles.find((p) => p.userId === wo.reportedById);
        if (prof) {
          prof.carbonSavedKg += carbonSaved;
          prof.updatedAt = now;
        }

        // Also update matching StudentReport
        const matchingRep = db.studentReports.find(
          (r) =>
            r.userId === wo.reportedById &&
            (r.title.includes(wo.title.replace("[AUTO-DISPATCH]", "").trim()) ||
              wo.title.includes(r.title))
        );
        if (matchingRep) {
          matchingRep.status = "RESOLVED";
          matchingRep.feedback = `Repaired by Maintenance: ${wo.resolutionNotes}`;
          matchingRep.updatedAt = now;
        }
      }
    }

    this.persist();
    return { workOrder: wo, studentNotice };
  }

  // ==========================================
  // CAMPUS EVENTS
  // ==========================================

  public getAllEvents(userId?: string) {
    const db = this.ensureDatabaseLoaded();
    const events = db.campusEvents.slice().sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

    return events.map((evt) => {
      const registrations = db.eventRegistrations.filter((r) => r.eventId === evt.id);
      const isRegistered = userId ? registrations.some((r) => r.userId === userId) : false;
      const userReg = userId ? registrations.find((r) => r.userId === userId) : null;

      const attendees = registrations.map((r) => {
        const user = db.users.find((u) => u.id === r.userId);
        return {
          id: r.id,
          userId: r.userId,
          name: user?.name || "Student Attendee",
          email: user?.email || "",
          studentId: user?.studentId || "STU-REG",
          attended: r.attended,
          pointsClaimed: r.pointsClaimed,
        };
      });

      return {
        ...evt,
        registeredCount: registrations.length,
        isRegistered,
        pointsClaimed: userReg?.pointsClaimed ?? false,
        attended: userReg?.attended ?? false,
        attendees,
      };
    });
  }

  public createEvent(data: {
    title: string;
    category?: string;
    description: string;
    location: string;
    eventDate: string;
    durationMinutes?: number;
    ecoPoints?: number;
    capacity?: number;
    organizer?: string;
  }): CampusEvent {
    const db = this.ensureDatabaseLoaded();
    const id = `evt-${Date.now()}`;
    const newEvent: CampusEvent = {
      id,
      title: data.title,
      category: data.category || "WORKSHOP",
      description: data.description,
      location: data.location,
      eventDate: data.eventDate,
      durationMinutes: Number(data.durationMinutes) || 120,
      ecoPoints: Number(data.ecoPoints) || 100,
      capacity: Number(data.capacity) || 50,
      organizer: data.organizer || "Dept of Renewable Energy & Student Council",
      createdAt: new Date().toISOString(),
    };

    db.campusEvents.push(newEvent);
    this.persist();
    return newEvent;
  }

  public deleteEvent(id: string): boolean {
    const db = this.ensureDatabaseLoaded();
    const prev = db.campusEvents.length;
    db.campusEvents = db.campusEvents.filter((e) => e.id !== id);
    db.eventRegistrations = db.eventRegistrations.filter((er) => er.eventId !== id);

    if (db.campusEvents.length !== prev) {
      this.persist();
      return true;
    }
    return false;
  }

  public registerForEvent(eventId: string, userId: string) {
    const db = this.ensureDatabaseLoaded();
    const existing = db.eventRegistrations.find((r) => r.eventId === eventId && r.userId === userId);
    if (existing) return existing;

    const newReg: EventRegistration = {
      id: `reg-${Date.now()}`,
      eventId,
      userId,
      attended: false,
      pointsClaimed: false,
      registeredAt: new Date().toISOString(),
    };

    db.eventRegistrations.push(newReg);
    this.persist();
    return newReg;
  }

  public cancelEventRegistration(eventId: string, userId: string) {
    const db = this.ensureDatabaseLoaded();
    db.eventRegistrations = db.eventRegistrations.filter((r) => !(r.eventId === eventId && r.userId === userId));
    this.persist();
    return true;
  }

  public claimEventPoints(eventId: string, userId: string): { success: boolean; points: number } {
    const db = this.ensureDatabaseLoaded();
    const reg = db.eventRegistrations.find((r) => r.eventId === eventId && r.userId === userId);
    const event = db.campusEvents.find((e) => e.id === eventId);

    if (!reg || !event) return { success: false, points: 0 };
    if (reg.pointsClaimed) return { success: true, points: event.ecoPoints };

    reg.attended = true;
    reg.pointsClaimed = true;
    this.adjustEcoPoints(userId, event.ecoPoints, `Attended event: ${event.title}`);
    this.persist();
    return { success: true, points: event.ecoPoints };
  }

  // ==========================================
  // REWARDS & REDEMPTIONS
  // ==========================================

  public getAllRewards(filter?: { category?: string }) {
    const db = this.ensureDatabaseLoaded();
    let rewards = db.rewards.filter((r) => r.isActive);
    if (filter?.category && filter.category !== "ALL") {
      rewards = rewards.filter((r) => r.category === filter.category);
    }
    rewards.sort((a, b) => a.pointsCost - b.pointsCost);
    return rewards;
  }

  public getRedemptionsForUser(userId: string) {
    const db = this.ensureDatabaseLoaded();
    const userRedemptions = db.rewardRedemptions.filter((r) => r.userId === userId);
    userRedemptions.sort((a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime());

    return userRedemptions.map((rdm) => {
      const reward = db.rewards.find((r) => r.id === rdm.rewardId);
      return {
        ...rdm,
        reward: reward || { title: "Eco-Friendly Reward Voucher", category: "VOUCHER", pointsCost: rdm.pointsSpent },
      };
    });
  }

  public redeemReward(rewardId: string, userId: string) {
    const db = this.ensureDatabaseLoaded();
    const reward = db.rewards.find((r) => r.id === rewardId);
    if (!reward || !reward.isActive) {
      throw new Error("Reward is currently unavailable.");
    }

    if (reward.stock <= 0) {
      throw new Error("This reward is out of stock.");
    }

    const profile = db.profiles.find((p) => p.userId === userId);
    if (!profile || profile.totalEcoPoints < reward.pointsCost) {
      throw new Error(`Insufficient Eco-Points. Required: ${reward.pointsCost} PTS.`);
    }

    const now = new Date();
    const expiresAt = new Date(Date.now() + 86400000 * 30).toISOString();
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const voucherCode = `${reward.codePrefix}-${randomHex}`;

    // Decrement points
    this.adjustEcoPoints(userId, -reward.pointsCost, `Redeemed voucher: ${reward.title}`);

    // Decrement stock
    reward.stock = Math.max(0, reward.stock - 1);

    // Create redemption record
    const newRedemption: RewardRedemption = {
      id: `rdm-${Date.now()}`,
      rewardId: reward.id,
      userId,
      voucherCode,
      pointsSpent: reward.pointsCost,
      redeemedAt: now.toISOString(),
      expiresAt,
      isUsed: false,
    };

    db.rewardRedemptions.unshift(newRedemption);
    this.persist();

    return {
      redemption: { ...newRedemption, reward },
      remainingPoints: profile.totalEcoPoints,
    };
  }

  // ==========================================
  // CARBON FOOTPRINT CALCULATOR
  // ==========================================

  public getCalculationsForUser(userId: string, limit = 5) {
    const db = this.ensureDatabaseLoaded();
    return db.carbonCalculations
      .filter((c) => c.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  public createCalculation(data: {
    userId: string;
    commuteMode: string;
    commuteKmPerWeek: number;
    dietType: string;
    dormElectricityHours: number;
    recyclingRate: number;
    totalAnnualKgCo2: number;
    transportKg: number;
    dietKg: number;
    energyKg: number;
    wasteKg: number;
    aiTip: string;
  }): CarbonCalculation {
    const db = this.ensureDatabaseLoaded();
    const now = new Date().toISOString();
    const newCalc: CarbonCalculation = {
      id: `calc-${Date.now()}`,
      userId: data.userId,
      commuteMode: data.commuteMode,
      commuteKmPerWeek: data.commuteKmPerWeek,
      dietType: data.dietType,
      dormElectricityHours: data.dormElectricityHours,
      recyclingRate: data.recyclingRate,
      totalAnnualKgCo2: data.totalAnnualKgCo2,
      transportKg: data.transportKg,
      dietKg: data.dietKg,
      energyKg: data.energyKg,
      wasteKg: data.wasteKg,
      aiTip: data.aiTip,
      createdAt: now,
    };

    db.carbonCalculations.unshift(newCalc);

    // Award +40 eco points
    this.adjustEcoPoints(data.userId, 40, "Completed annual carbon footprint audit");

    this.persist();
    return newCalc;
  }

  // ==========================================
  // DEPARTMENTS
  // ==========================================

  public getAllDepartments() {
    const db = this.ensureDatabaseLoaded();
    return db.departments;
  }

  public createDepartment(data: {
    name: string;
    code: string;
    headName?: string;
    annualEnergyBudgetCapKw?: number;
  }): Department {
    const db = this.ensureDatabaseLoaded();
    const id = `dept-${Date.now()}`;
    const newDept: Department = {
      id,
      code: data.code,
      name: data.name,
      headName: data.headName || "Unassigned",
      studentCount: 0,
      facultyCount: 1,
      annualEnergyBudgetCapKw: Number(data.annualEnergyBudgetCapKw) || 40.0,
      currentPowerDrawKw: 14.5,
      carbonOffsetTonnes: 0.0,
      esgRating: "Under Audit",
      status: "OPTIMAL",
      createdAt: new Date().toISOString(),
    };

    db.departments.push(newDept);
    this.persist();
    return newDept;
  }

  // ==========================================
  // ANOMALY ALERTS & AI INSIGHTS
  // ==========================================

  public getAllAlerts() {
    const db = this.ensureDatabaseLoaded();
    return db.anomalyAlerts;
  }

  public resolveAlert(id: string) {
    const db = this.ensureDatabaseLoaded();
    const alert = db.anomalyAlerts.find((a) => a.id === id);
    if (alert) {
      alert.isResolved = true;
      this.persist();
      return true;
    }
    return false;
  }

  public getAllAIInsights() {
    const db = this.ensureDatabaseLoaded();
    return db.aiInsights;
  }

  public createAIInsight(data: Omit<AIInsight, "id" | "createdAt">): AIInsight {
    const db = this.ensureDatabaseLoaded();
    const newInsight: AIInsight = {
      ...data,
      id: `ai-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    db.aiInsights.unshift(newInsight);
    this.persist();
    return newInsight;
  }

  // ==========================================
  // LEADERBOARD & STATS
  // ==========================================

  public getLeaderboard(limit = 10) {
    const db = this.ensureDatabaseLoaded();
    const studentsWithPoints = db.users
      .filter((u) => u.role === "STUDENT")
      .map((u) => {
        const prof = db.profiles.find((p) => p.userId === u.id);
        return {
          id: u.id,
          name: u.name,
          department: u.department || "General Eco-Member",
          avatarUrl: u.avatarUrl,
          totalEcoPoints: prof?.totalEcoPoints ?? 0,
          carbonSavedKg: prof?.carbonSavedKg ?? 0,
          streakDays: prof?.streakDays ?? 1,
        };
      })
      .sort((a, b) => b.totalEcoPoints - a.totalEcoPoints);

    const rankedStudents = studentsWithPoints.slice(0, limit).map((s, idx) => ({
      ...s,
      rank: idx + 1,
      badge:
        idx === 0
          ? "🏆 Eco Legend"
          : idx === 1
          ? "🥈 Green Champion"
          : idx === 2
          ? "🥉 Zero Waste Master"
          : "⭐ Green Pioneer",
    }));

    return {
      students: rankedStudents,
      dorms: [
        { rank: 1, dormName: "EcoLiving Dorm Cluster", buildingCode: "BLD-DORM-03", totalPoints: 4820, energyReductionPercent: 24.5, wasteRecycledKg: 640.0, residentCount: 450 },
        { rank: 2, dormName: "North Quad Residence Hall", buildingCode: "BLD-DORM-01", totalPoints: 4190, energyReductionPercent: 19.2, wasteRecycledKg: 520.0, residentCount: 380 },
        { rank: 3, dormName: "Highland Tower Residence", buildingCode: "BLD-DORM-02", totalPoints: 3750, energyReductionPercent: 16.8, wasteRecycledKg: 460.0, residentCount: 410 },
      ],
      departments: db.departments.map((d, idx) => ({
        rank: idx + 1,
        deptName: d.name,
        totalPoints: 5000 + (db.departments.length - idx) * 1200,
        carbonSavedKg: d.carbonOffsetTonnes * 1000,
        activeQuestsDone: 80 + (db.departments.length - idx) * 20,
      })),
    };
  }

  public getCampusStats() {
    const db = this.ensureDatabaseLoaded();
    const pendingReports = db.studentReports.filter((r) => r.status === "PENDING").length;
    const activeWorkOrders = db.workOrders.filter(
      (w) => w.status !== "RESOLVED" && w.status !== "CANCELLED"
    ).length;
    const activeMeters = db.utilityMeters.filter((m) => m.status === "ACTIVE").length;

    let totalCarbonSavedKg = db.profiles.reduce((sum, p) => sum + (p.carbonSavedKg || 0), 0);
    if (totalCarbonSavedKg < 142800) totalCarbonSavedKg = 142800; // campus historical base

    return {
      totalUsers: db.users.length,
      totalBuildings: db.buildings.length,
      totalDepartments: db.departments.length,
      totalCarbonSavedTonnes: Math.round((totalCarbonSavedKg / 1000) * 10) / 10,
      pendingReportApprovals: pendingReports,
      activeIoTMeters: activeMeters,
      activeWorkOrders,
      systemHealth: "OPTIMAL_100%",
      storageMode: "Pre-Backend Persistent JSON Engine",
      dataFile: DB_FILE_PATH,
    };
  }
}

// Singleton instance
export const prebackend = new PreBackendStore();
export default prebackend;
