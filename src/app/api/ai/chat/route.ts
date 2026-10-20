import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prebackend from "@/lib/prebackend";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.userId;
    const body = await request.json();
    const { message, topic = "GENERAL", userRole = session?.role || "STUDENT" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message string is required." }, { status: 400 });
    }

    const query = message.toLowerCase();
    let reply = "";
    let category = "ENERGY";
    let projectedCo2SavingsKg = 0;
    let projectedCostSavingsUsd = 0;
    let suggestedAction = "";

    // 1. Energy Saving Recommendations
    if (
      query.includes("energy") ||
      query.includes("power") ||
      query.includes("hvac") ||
      query.includes("solar") ||
      query.includes("light") ||
      topic === "ENERGY"
    ) {
      category = "ENERGY";
      projectedCo2SavingsKg = 145.0;
      projectedCostSavingsUsd = 42.0;
      suggestedAction = "Enable Automated Smart LED Deep-Sleep Schedule between 1:00 AM - 5:00 AM.";

      reply = `⚡ **AI Energy Optimization Recommendation:**

Based on live telemetry, campus HVAC and lighting account for 58% of baseline power draw.

**Key Actionable Steps:**
1. **Pre-Cooling during Solar Surplus:** Pre-cool lecture halls between 12:00 PM - 2:30 PM when rooftop solar generates +420 kW excess power.
2. **Eliminate Phantom Draw:** Set computer lab rigs to auto-hibernate after 15 minutes of inactivity.
3. **Smart Thermostat Setpoints:** Modulate thermostat to 22°C during lectures and 24°C during off-peak hours.

*Estimated Annual Carbon Impact:* **-${projectedCo2SavingsKg} kg CO2e / year** per room.`;
    }
    // 2. Water Saving Tips
    else if (
      query.includes("water") ||
      query.includes("leak") ||
      query.includes("rain") ||
      query.includes("plumb") ||
      topic === "WATER"
    ) {
      category = "WATER";
      projectedCo2SavingsKg = 85.0;
      projectedCostSavingsUsd = 30.0;
      suggestedAction = "Dispatch Acoustic Leak Audit for Sub-basement Chiller Loop B.";

      reply = `💧 **AI Water Conservation & Leak Prevention Advice:**

Campus rainwater harvesting currently supplies 42% of non-potable needs.

**Recommended Actions:**
1. **Acoustic Leak Detection:** Address micro-leaks immediately; a 5 L/min leak wastes 7,200 Liters daily.
2. **Install Aerators:** Equip dorm and lab faucets with 1.5 GPM low-flow aerators to cut utility draw by 35%.
3. **Expand Rainwater Catchment:** Divert Library rooftop runoff into Quad Tank #2 before winter rains.

*Projected Water Saved:* **+125,000 Liters / year**.`;
    }
    // 3. Waste Reduction Suggestions
    else if (
      query.includes("waste") ||
      query.includes("recycle") ||
      query.includes("plastic") ||
      query.includes("compost") ||
      topic === "WASTE"
    ) {
      category = "WASTE";
      projectedCo2SavingsKg = 110.0;
      projectedCostSavingsUsd = 25.0;
      suggestedAction = "Log 5 compost weigh-ins at Student Union Smart Bins.";

      reply = `♻️ **AI Waste Reduction & Circular Economy Strategy:**

Current campus landfill diversion rate is **86.2%**.

**Key Recommendations:**
1. **Dining Hall Food Waste:** Log meal remnants at organic compost bins to divert 480 kg of organic waste weekly.
2. **E-Waste Salvage:** Drop unneeded electronics at Engineering Concourse Recyclathon for circuit component recovery.
3. **Eliminate Single-Use Plastics:** Switch to biodegradable bamboo/paper dining utensils across all campus cafes.

*Earnable Eco-Points:* **+120 PTS** per completed waste reduction quest.`;
    }
    // 4. Carbon Footprint Insights
    else if (
      query.includes("carbon") ||
      query.includes("co2") ||
      query.includes("commute") ||
      query.includes("offset") ||
      query.includes("tree") ||
      topic === "CARBON"
    ) {
      category = "CARBON";
      projectedCo2SavingsKg = 320.0;
      projectedCostSavingsUsd = 85.0;
      suggestedAction = "Switch 3 weekly commute days from solo car to EV Campus Shuttle or Cycling.";

      reply = `🌿 **AI Carbon Decarbonization Insight:**

Your personal carbon footprint calculation is **43% lower** than the national student average of 3,200 kg CO2/year!

**Targeted Decarbonization Steps:**
1. **Zero-Emission Commute:** Riding a bicycle or taking the zero-emission electric shuttle slashes transport emissions to 0 kg.
2. **Plant-Based Meatless Mondays:** Replacing 1 meat meal per week saves ~300 kg CO2e annually.
3. **Sponsor Native Trees:** Plant native oak saplings during the campus Tree Planting Drive to sequester 20 kg CO2/tree.

*Net CO2 Reduction Potential:* **-${projectedCo2SavingsKg} kg CO2e / year**.`;
    }
    // 5. Default / General Sustainability Advice
    else {
      category = "GENERAL";
      projectedCo2SavingsKg = 95.0;
      projectedCostSavingsUsd = 20.0;
      suggestedAction = "Complete your annual Carbon Footprint Audit in the Student Portal.";

      reply = `🤖 **GreenCampus AI Sustainability Advisor:**

Welcome! I am your AI climate & sustainability advisor. I monitor real-time campus microgrid telemetry, building energy ratings, and student eco-actions.

**How I can assist you:**
• ⚡ **Energy Saving:** Smart HVAC setpoints, solar peak load shifting & phantom load reduction.
• 💧 **Water Conservation:** Leak detection, rainwater catchment & low-flow fixtures.
• ♻️ **Waste Management:** Compost sorting, e-waste salvage & zero-plastic policies.
• 🌿 **Carbon Decarbonization:** Personal GHG footprint calculation & zero-emission commutes.

Feel free to ask me any specific question about your dorm, lab energy draw, or eco-points!`;
    }

    // Save insight to Pre-Backend if relevant
    if (projectedCo2SavingsKg > 0) {
      try {
        prebackend.createAIInsight({
          targetType: userRole === "ADMIN" ? "CAMPUS_WIDE" : "STUDENT",
          title: `AI Recommendation: ${category} Conservation`,
          insightSummary: suggestedAction,
          suggestedAction,
          confidenceScore: 0.92,
          projectedSavingsKwh: projectedCo2SavingsKg * 2.2,
          projectedSavingsUsd: projectedCostSavingsUsd,
          projectedCarbonReductionKg: projectedCo2SavingsKg,
          status: "NEW",
        });
      } catch {
        // Non-critical logging
      }
    }

    return NextResponse.json({
      success: true,
      reply,
      recommendation: {
        category,
        projectedCo2SavingsKg,
        projectedCostSavingsUsd,
        suggestedAction,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Sustainability Advisor API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
