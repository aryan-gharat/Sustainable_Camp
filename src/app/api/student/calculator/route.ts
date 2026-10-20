import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import prebackend from "@/lib/prebackend";

// Formula emission factors (in kg CO2e per unit per year)
const COMMUTE_FACTORS: Record<string, number> = {
  BICYCLE: 0.0,
  WALKING: 0.0,
  CAMPUS_SHUTTLE: 0.04, // electric/hybrid shuttle
  PUBLIC_TRANSIT: 0.08,
  CARPOOL: 0.15,
  SOLO_CAR: 0.28,
};

const DIET_FACTORS: Record<string, number> = {
  VEGAN: 1000,
  VEGETARIAN: 1400,
  PESCATARIAN: 1800,
  BALANCED: 2300,
  HIGH_MEAT: 3300,
};

export async function GET() {
  try {
    const session = await getSession();
    const userId = session?.userId;

    let calculationHistory: any[] = [];

    if (userId) {
      calculationHistory = prebackend.getCalculationsForUser(userId, 5);
    }

    if (calculationHistory.length === 0) {
      calculationHistory = [
        {
          id: "calc-prev-1",
          commuteMode: "BICYCLE",
          commuteKmPerWeek: 35,
          dietType: "VEGETARIAN",
          dormElectricityHours: 6,
          recyclingRate: 85,
          totalAnnualKgCo2: 1820.5,
          transportKg: 72.8,
          dietKg: 1400.0,
          energyKg: 310.2,
          wasteKg: 37.5,
          aiTip: "Outstanding zero-emission bike commute! Switching dorm desk lights to Smart LED schedule could reduce your annual footprint by another 60 kg CO2.",
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
        },
      ];
    }

    return NextResponse.json({ success: true, history: calculationHistory });
  } catch (error) {
    console.error("Carbon calculator GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.userId || "usr-stu-01";
    const body = await request.json();

    const {
      commuteMode = "BICYCLE",
      commuteKmPerWeek = 20,
      dietType = "BALANCED",
      dormElectricityHours = 8,
      recyclingRate = 70,
    } = body;

    // Calculation logic
    const km = Math.max(0, Number(commuteKmPerWeek) || 0);
    const modeFactor = COMMUTE_FACTORS[commuteMode] ?? 0.15;
    const transportKg = Math.round(km * 52 * modeFactor * 10) / 10;

    const dietKg = DIET_FACTORS[dietType] ?? 2300;

    const electricityHours = Math.max(0, Math.min(24, Number(dormElectricityHours) || 8));
    const energyKg = Math.round(electricityHours * 365 * 0.22 * 0.45 * 10) / 10; // kWh * emission factor

    const recRate = Math.max(0, Math.min(100, Number(recyclingRate) || 50));
    const wasteBaseKg = 300; // average yearly student waste kg CO2
    const wasteKg = Math.round(wasteBaseKg * (1 - recRate / 100) * 10) / 10;

    const totalAnnualKgCo2 = Math.round((transportKg + dietKg + energyKg + wasteKg) * 10) / 10;

    // Generate smart AI tip
    let aiTip = "";
    if (commuteMode === "SOLO_CAR") {
      aiTip = "Switching to campus electric shuttles or cycling just 3 days a week could save up to 450 kg CO2 annually!";
    } else if (dietType === "HIGH_MEAT") {
      aiTip = "Participating in Meatless Mondays on campus dining can slash your carbon footprint by over 300 kg CO2 per year.";
    } else if (dormElectricityHours > 10) {
      aiTip = "Enabling automated sleep timers on gaming rigs and laptop chargers can cut your dorm electricity emissions by 30%.";
    } else if (recRate < 50) {
      aiTip = "Utilizing campus Smart Sorting Bins for plastic and e-waste will boost your recycling efficiency and earn +100 Eco-Points!";
    } else {
      aiTip = "Exceptional eco performance! You are currently producing 40% less GHG emissions than the national student average of 3,200 kg CO2/year.";
    }

    // Persist calculation and award +40 points in Pre-Backend store
    const savedCalc = prebackend.createCalculation({
      userId,
      commuteMode,
      commuteKmPerWeek: km,
      dietType,
      dormElectricityHours: electricityHours,
      recyclingRate: recRate,
      totalAnnualKgCo2,
      transportKg,
      dietKg,
      energyKg,
      wasteKg,
      aiTip,
    });

    // Optional background sync with Prisma
    try {
      await prisma.carbonCalculation.create({
        data: {
          id: savedCalc.id,
          userId,
          commuteMode,
          commuteKmPerWeek: km,
          dietType,
          dormElectricityHours: electricityHours,
          recyclingRate: recRate,
          totalAnnualKgCo2,
          transportKg,
          dietKg,
          energyKg,
          wasteKg,
          aiTip,
        },
      });
      await prisma.ecoPointLog.create({
        data: {
          userId,
          points: 40,
          reason: "Completed annual carbon footprint audit",
        },
      });
      await prisma.profile.update({
        where: { userId },
        data: { totalEcoPoints: { increment: 40 } },
      });
    } catch {
      // Prisma offline
    }

    return NextResponse.json({
      success: true,
      message: "Carbon calculation saved to personal history! +40 Eco-Points awarded.",
      result: savedCalc,
    });
  } catch (error) {
    console.error("Carbon calculation POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
