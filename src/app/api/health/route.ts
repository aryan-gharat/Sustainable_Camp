import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  let dbStatus = "unknown";
  try {
    // Attempt lightweight ping
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch (error) {
    dbStatus = "disconnected / awaiting postgres";
  }

  return NextResponse.json({
    system: "GreenCampus AI",
    status: "healthy",
    version: "1.0.0",
    framework: "Next.js 15 (App Router)",
    database: dbStatus,
    timestamp: new Date().toISOString(),
    supportedRoles: ["STUDENT", "FACULTY", "ADMIN", "MAINTENANCE_STAFF"],
  });
}
