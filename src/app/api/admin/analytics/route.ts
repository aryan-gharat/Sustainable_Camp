import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();

    let campusAnalytics = {
      totalCampusPowerDrawKw: 184.2,
      totalRooftopSolarGenerationKw: 420.0,
      netCleanEnergyRatioPercent: 68.4,
      totalAnnualCarbonFootprintTonnes: 142.8,
      totalWaterConservedLiters: 125000,
      landfillDiversionRatePercent: 86.2,
      buildingPerformanceRankings: [
        { name: "Solar Science & Tech Complex", rating: "LEED Platinum", powerKw: 28.4, offsetTonnes: 45.2 },
        { name: "EcoLiving Dormitory Cluster", rating: "Net-Zero Ready", powerKw: 18.2, offsetTonnes: 38.0 },
        { name: "Verdant Academic Quad", rating: "LEED Gold", powerKw: 42.6, offsetTonnes: 28.5 },
        { name: "Central Memorial Library", rating: "EnergyStar 88", powerKw: 38.0, offsetTonnes: 18.2 },
      ],
      hourlyTelemetry: [
        { hour: "00:00", gridKw: 95, solarKw: 0 },
        { hour: "04:00", gridKw: 80, solarKw: 0 },
        { hour: "08:00", gridKw: 210, solarKw: 180 },
        { hour: "12:00", gridKw: 140, solarKw: 420 },
        { hour: "16:00", gridKw: 190, solarKw: 280 },
        { hour: "20:00", gridKw: 130, solarKw: 0 },
      ],
    };

    return NextResponse.json({ success: true, analytics: campusAnalytics });
  } catch (error) {
    console.error("Admin analytics API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
