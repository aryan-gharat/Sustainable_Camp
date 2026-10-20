import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prebackend from "@/lib/prebackend";

export async function GET() {
  try {
    const session = await getSession();
    const buildings = prebackend.getAllBuildings();
    const stats = prebackend.getCampusStats();

    const buildingPerformanceRankings = buildings.map((b) => {
      const elecMeter = b.meters.find((m) => m.meterType === "ELECTRICITY");
      return {
        name: b.name,
        rating: b.currentEnergyRating,
        powerKw: elecMeter ? 28.4 : 18.2,
        offsetTonnes: b.solarPanelsInstalled ? 45.2 : 18.0,
      };
    });

    const campusAnalytics = {
      totalCampusPowerDrawKw: 184.2,
      totalRooftopSolarGenerationKw: 420.0,
      netCleanEnergyRatioPercent: 68.4,
      totalAnnualCarbonFootprintTonnes: stats.totalCarbonSavedTonnes,
      totalWaterConservedLiters: 125000,
      landfillDiversionRatePercent: 86.2,
      buildingPerformanceRankings,
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
