import { Role } from "@/types/auth";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: Role;
  department: string | null;
  studentId: string | null;
  staffId: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  bio: string | null;
  totalEcoPoints: number;
  carbonSavedKg: number;
  waterSavedLiters: number;
  streakDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface Building {
  id: string;
  name: string;
  code: string;
  category: string;
  grossFloorAreaSqM: number;
  yearBuilt: number;
  occupancyCapacity: number;
  solarPanelsInstalled: boolean;
  rainwaterHarvesting: boolean;
  currentEnergyRating: string;
  createdAt: string;
  updatedAt: string;
}

export interface UtilityMeter {
  id: string;
  buildingId: string;
  meterType: "ELECTRICITY" | "WATER" | "GAS" | "SOLAR_PV" | "HVAC_CHILLED_WATER";
  meterSerial: string;
  locationDescription: string;
  unitOfMeasure: string;
  status: "ACTIVE" | "CALIBRATION_NEEDED" | "OFFLINE" | "FAULT";
  lastTelemetryAt: string;
  createdAt: string;
}

export interface MeterReading {
  id: string;
  meterId: string;
  timestamp: string;
  value: number;
  unit: string;
  carbonEquivalentKg: number;
}

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  title: string;
  description: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "SUBMITTED" | "ACKNOWLEDGED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";
  locationDetails: string;
  buildingName?: string | null;
  buildingId?: string | null;
  reportedById?: string | null;
  assignedToId?: string | null;
  estimatedCarbonLossKg: number;
  resolutionNotes?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentReport {
  id: string;
  userId: string;
  title: string;
  category: string;
  description: string;
  location: string;
  buildingName?: string | null;
  impactEstKgCo2: number;
  proofUrl?: string | null;
  status: "PENDING" | "VERIFIED" | "REJECTED" | "RESOLVED";
  pointsAwarded: number;
  feedback?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  eventDate: string;
  durationMinutes: number;
  ecoPoints: number;
  capacity: number;
  organizer: string;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  attended: boolean;
  pointsClaimed: boolean;
  registeredAt: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  category: "DINING" | "VOUCHER" | "COMMUTE" | "MERCHANDISE" | "TECH";
  pointsCost: number;
  stock: number;
  codePrefix: string;
  isActive: boolean;
  createdAt: string;
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  userId: string;
  voucherCode: string;
  pointsSpent: number;
  redeemedAt: string;
  expiresAt: string;
  isUsed: boolean;
}

export interface EcoPointLog {
  id: string;
  userId: string;
  points: number;
  reason: string;
  createdAt: string;
}

export interface GreenQuest {
  id: string;
  title: string;
  description: string;
  category: string;
  rewardEcoPoints: number;
  co2ReductionEstKg: number;
  createdAt: string;
}

export interface QuestCompletion {
  id: string;
  questId: string;
  userId: string;
  proofNotes?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  awardedPoints: number;
  completedAt: string;
}

export interface AnomalyAlert {
  id: string;
  severity: "LOW" | "MEDIUM" | "WARNING" | "HIGH" | "CRITICAL";
  anomalyType: string;
  buildingName: string;
  buildingId?: string | null;
  title: string;
  description: string;
  detectedAt: string;
  isResolved: boolean;
  diagnosticDetails: string;
}

export interface AIInsight {
  id: string;
  targetType: "CAMPUS_WIDE" | "BUILDING" | "STUDENT";
  title: string;
  insightSummary: string;
  suggestedAction: string;
  confidenceScore: number;
  projectedSavingsKwh: number;
  projectedSavingsUsd: number;
  projectedCarbonReductionKg: number;
  status: "NEW" | "ACKNOWLEDGED" | "APPLIED" | "DISMISSED";
  createdAt: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  headName: string;
  studentCount: number;
  facultyCount: number;
  annualEnergyBudgetCapKw: number;
  currentPowerDrawKw: number;
  carbonOffsetTonnes: number;
  esgRating: string;
  status: "OPTIMAL" | "ATTENTION_NEEDED" | "CRITICAL";
  createdAt: string;
}

export interface CarbonCalculation {
  id: string;
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
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: string | null;
  createdAt: string;
}

export interface CampusDatabaseSchema {
  version: string;
  lastUpdated: string;
  users: User[];
  profiles: Profile[];
  buildings: Building[];
  utilityMeters: UtilityMeter[];
  meterReadings: MeterReading[];
  workOrders: WorkOrder[];
  studentReports: StudentReport[];
  campusEvents: CampusEvent[];
  eventRegistrations: EventRegistration[];
  rewards: Reward[];
  rewardRedemptions: RewardRedemption[];
  ecoPointLogs: EcoPointLog[];
  greenQuests: GreenQuest[];
  questCompletions: QuestCompletion[];
  anomalyAlerts: AnomalyAlert[];
  aiInsights: AIInsight[];
  departments: Department[];
  carbonCalculations: CarbonCalculation[];
  auditLogs: AuditLog[];
}
