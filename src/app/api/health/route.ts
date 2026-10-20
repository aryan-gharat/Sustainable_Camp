import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import prebackend from "@/lib/prebackend";

export async function GET() {
  let postgresStatus = "disconnected";
  try {
    await prisma.$queryRaw`SELECT 1`;
    postgresStatus = "connected";
  } catch {
    postgresStatus = "offline (using Pre-Backend persistent store)";
  }

  const stats = prebackend.getCampusStats();

  return NextResponse.json({
    system: "GreenCampus AI",
    status: "healthy",
    version: "1.0.0",
    framework: "Next.js 15 (App Router)",
    prebackend: {
      status: "active",
      storageEngine: "Pre-Backend Persistent JSON Engine (Self-Healing)",
      dataFile: stats.dataFile,
      metrics: {
        totalUsers: stats.totalUsers,
        totalBuildings: stats.totalBuildings,
        totalDepartments: stats.totalDepartments,
        pendingReports: stats.pendingReportApprovals,
        activeWorkOrders: stats.activeWorkOrders,
        activeIoTMeters: stats.activeIoTMeters,
      },
    },
    postgresDatabase: postgresStatus,
    timestamp: new Date().toISOString(),
    supportedRoles: ["STUDENT", "FACULTY", "ADMIN", "MAINTENANCE_STAFF"],
  });
}
