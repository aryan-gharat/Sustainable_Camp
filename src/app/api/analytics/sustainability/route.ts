import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();

    // Summary Metrics
    const metrics = {
      campusSustainabilityScore: {
        score: 94,
        maxScore: 100,
        rating: "LEED Platinum Index",
        improvement: "+4.5 pts",
        trend: "positive",
      },
      energyConsumption: {
        currentDrawKw: 184.2,
        solarGenerationKw: 420.0,
        cleanEnergyRatio: 68.4,
        change: "-14.2% vs baseline",
      },
      waterUsage: {
        totalConservedLiters: 125000,
        currentFlowLitersPerHr: 340,
        rainwaterSharePercent: 42.0,
        change: "-18.5% utility draw",
      },
      wasteManagement: {
        diversionRatePercent: 86.2,
        recycledKgWeekly: 640.0,
        compostedKgWeekly: 480.0,
        change: "+12.4% recycled",
      },
      carbonFootprint: {
        annualEmissionsTonnes: 142.8,
        treeEquivalent: 7140,
        targetTonnes: 180.0,
        change: "-24.8% net reduction",
      },
    };

    // Recharts Time-Series & Category Datasets
    const chartsData = {
      // 1. Energy Consumption & Solar PV 24h Hourly Curve (AreaChart)
      hourlyEnergy: [
        { hour: "00:00", gridKw: 95, solarKw: 0, totalDemandKw: 95 },
        { hour: "02:00", gridKw: 88, solarKw: 0, totalDemandKw: 88 },
        { hour: "04:00", gridKw: 82, solarKw: 0, totalDemandKw: 82 },
        { hour: "06:00", gridKw: 120, solarKw: 35, totalDemandKw: 155 },
        { hour: "08:00", gridKw: 180, solarKw: 140, totalDemandKw: 320 },
        { hour: "10:00", gridKw: 140, solarKw: 280, totalDemandKw: 420 },
        { hour: "12:00", gridKw: 90, solarKw: 420, totalDemandKw: 510 },
        { hour: "14:00", gridKw: 110, solarKw: 390, totalDemandKw: 500 },
        { hour: "16:00", gridKw: 160, solarKw: 240, totalDemandKw: 400 },
        { hour: "18:00", gridKw: 210, solarKw: 80, totalDemandKw: 290 },
        { hour: "20:00", gridKw: 170, solarKw: 0, totalDemandKw: 170 },
        { hour: "22:00", gridKw: 120, solarKw: 0, totalDemandKw: 120 },
      ],

      // 2. Water Usage & Rainwater Catchment Monthly (BarChart)
      monthlyWater: [
        { month: "Jan", utilityWater: 420, rainwater: 180 },
        { month: "Feb", utilityWater: 390, rainwater: 210 },
        { month: "Mar", utilityWater: 360, rainwater: 250 },
        { month: "Apr", utilityWater: 340, rainwater: 280 },
        { month: "May", utilityWater: 310, rainwater: 320 },
        { month: "Jun", utilityWater: 290, rainwater: 350 },
        { month: "Jul", utilityWater: 280, rainwater: 340 },
        { month: "Aug", utilityWater: 300, rainwater: 310 },
        { month: "Sep", utilityWater: 320, rainwater: 290 },
        { month: "Oct", utilityWater: 340, rainwater: 260 },
      ],

      // 3. Waste Management Category Breakdown (PieChart)
      wasteBreakdown: [
        { name: "Organic Compost", value: 42, color: "#10b981" },
        { name: "Plastic Recycling", value: 28, color: "#3b82f6" },
        { name: "Paper & Cardboard", value: 16, color: "#f59e0b" },
        { name: "E-Waste", value: 8, color: "#8b5cf6" },
        { name: "General Landfill", value: 6, color: "#f43f5e" },
      ],

      // 4. Carbon Footprint Reduction Trajectory (LineChart)
      carbonTrajectory: [
        { year: "2021", emissions: 240, target: 240 },
        { year: "2022", emissions: 215, target: 220 },
        { year: "2023", emissions: 190, target: 200 },
        { year: "2024", emissions: 168, target: 180 },
        { year: "2025", emissions: 152, target: 160 },
        { year: "2026", emissions: 142.8, target: 140 },
        { year: "2027 (Est)", emissions: 125, target: 120 },
        { year: "2030 (Net-Zero)", emissions: 0, target: 0 },
      ],

      // 5. Campus Sustainability Score Components (RadarChart / BarChart)
      scoreComponents: [
        { category: "Energy Efficiency", score: 96, benchmark: 80 },
        { category: "Renewable PV Ratio", score: 92, benchmark: 75 },
        { category: "Water Conservation", score: 88, benchmark: 70 },
        { category: "Waste Diversion", score: 95, benchmark: 70 },
        { category: "Student Engagement", score: 98, benchmark: 65 },
        { category: "Green Commute", score: 91, benchmark: 60 },
      ],
    };

    return NextResponse.json({
      success: true,
      metrics,
      chartsData,
    });
  } catch (error) {
    console.error("Sustainability Analytics API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
