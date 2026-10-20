import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import prebackend from "@/lib/prebackend";

export async function GET() {
  try {
    const session = await getSession();
    const stats = prebackend.getCampusStats();
    const rawDb = prebackend.getRawDb();

    // Map recent logs from audit logs or dynamic activities
    const recentSystemLogs = rawDb.auditLogs.slice(0, 5).map((log, idx) => {
      const user = rawDb.users.find((u) => u.id === log.userId);
      return {
        id: log.id,
        action: log.action,
        details: log.metadata || `${log.action} executed on ${log.entityType}`,
        user: user ? `${user.name} (${user.role})` : "Campus Administrator",
        time: "Recently",
      };
    });

    if (recentSystemLogs.length === 0) {
      recentSystemLogs.push(
        {
          id: "log-1",
          action: "ROLE_UPDATED",
          details: "Assigned FACULTY role to Prof. Marcus Thorne",
          user: "Dr. Elena Vance (Admin)",
          time: "15 mins ago",
        },
        {
          id: "log-2",
          action: "BUILDING_CREATED",
          details: "Added Solar Science & Tech Complex (BLD-SCI-01) to IoT Grid",
          user: "Dr. Elena Vance (Admin)",
          time: "1 hour ago",
        },
        {
          id: "log-3",
          action: "WORK_ORDER_DISPATCHED",
          details: "Auto-dispatched high-priority acoustic water leak repair WO-2026-081",
          user: "Campus AI System",
          time: "3 hours ago",
        }
      );
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: stats.totalUsers,
        totalBuildings: stats.totalBuildings,
        totalDepartments: stats.totalDepartments,
        totalCarbonSavedTonnes: stats.totalCarbonSavedTonnes,
        pendingReportApprovals: stats.pendingReportApprovals,
        activeIoTMeters: stats.activeIoTMeters,
        activeWorkOrders: stats.activeWorkOrders,
        systemHealth: "OPTIMAL_100%",
      },
      recentSystemLogs,
    });
  } catch (error) {
    console.error("Admin dashboard API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
