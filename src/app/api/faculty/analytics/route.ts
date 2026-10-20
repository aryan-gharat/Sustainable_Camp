import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prebackend from "@/lib/prebackend";

export async function GET() {
  try {
    const session = await getSession();
    const meters = prebackend.getAllMeters();

    const labRooms = meters.slice(0, 4).map((m, idx) => {
      const topReading = m.readings && m.readings.length > 0 ? m.readings[0] : null;
      return {
        id: m.id,
        name: `${m.building.name} - ${m.locationDescription}`,
        meterSerial: m.meterSerial,
        currentPowerKw: topReading?.value || 12.4 + idx * 3.2,
        status: m.status,
        carbonEquivalentKg: topReading?.carbonEquivalentKg || 5.2 + idx * 1.5,
        occupancyCount: 15 + idx * 8,
        hvacMode: "ECO_DYNAMIC_22C",
      };
    });

    const departmentTelemetry = {
      departmentName: "Dept of Renewable Energy & Smart Grid Systems",
      totalPowerKw: 52.7,
      solarGenerationOffsetKw: 38.4,
      netGridDrawKw: 14.3,
      waterUsageLitersPerHr: 340,
      recyclingDiversionRatePercent: 88.5,
      labRooms,
      hourlyTrendKw: [
        { hour: "00:00", gridKw: 12.0, solarKw: 0.0 },
        { hour: "04:00", gridKw: 10.5, solarKw: 0.0 },
        { hour: "08:00", gridKw: 32.0, solarKw: 14.2 },
        { hour: "12:00", gridKw: 14.3, solarKw: 38.4 },
        { hour: "16:00", gridKw: 24.0, solarKw: 22.1 },
        { hour: "20:00", gridKw: 18.0, solarKw: 0.0 },
      ],
    };

    return NextResponse.json({ success: true, analytics: departmentTelemetry });
  } catch (error) {
    console.error("Faculty analytics API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
