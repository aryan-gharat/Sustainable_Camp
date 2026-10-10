const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting GreenCampus AI Database Seeding...");

  const passwordHash = await bcrypt.hash("green2026!", 10);

  // 1. Create Core Role Users
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@greencampus.ai" },
    update: {},
    create: {
      email: "admin@greencampus.ai",
      name: "Dr. Elena Vance",
      passwordHash,
      role: "ADMIN",
      department: "Office of the President & Sustainability Council",
      staffId: "ADM-9021",
      profile: {
        create: {
          bio: "VP of Campus Infrastructure and Chief Sustainability Officer.",
          totalEcoPoints: 1250,
          carbonSavedKg: 340.5,
          streakDays: 45,
        },
      },
    },
  });

  const facultyUser = await prisma.user.upsert({
    where: { email: "faculty@greencampus.ai" },
    update: {},
    create: {
      email: "faculty@greencampus.ai",
      name: "Prof. Marcus Thorne",
      passwordHash,
      role: "FACULTY",
      department: "Dept of Renewable Energy & IoT Engineering",
      staffId: "FAC-4402",
      profile: {
        create: {
          bio: "Principal Investigator on Microgrid IoT and Smart Sensor networks.",
          totalEcoPoints: 890,
          carbonSavedKg: 215.0,
          streakDays: 28,
        },
      },
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: "student@greencampus.ai" },
    update: {},
    create: {
      email: "student@greencampus.ai",
      name: "Aiden Sharma",
      passwordHash,
      role: "STUDENT",
      department: "Environmental Engineering '27",
      studentId: "STU-88412",
      profile: {
        create: {
          bio: "Campus Eco-Club Lead and Sustainable Commute Ambassador.",
          totalEcoPoints: 580,
          carbonSavedKg: 122.4,
          waterSavedLiters: 1400.0,
          streakDays: 19,
        },
      },
    },
  });

  const maintenanceUser = await prisma.user.upsert({
    where: { email: "maintenance@greencampus.ai" },
    update: {},
    create: {
      email: "maintenance@greencampus.ai",
      name: "Carlos Mendez",
      passwordHash,
      role: "MAINTENANCE_STAFF",
      department: "Campus Facilities & Smart HVAC Operations",
      staffId: "MNT-1092",
      profile: {
        create: {
          bio: "Lead Facilities Specialist certified in high-efficiency heat pump systems.",
          totalEcoPoints: 720,
          carbonSavedKg: 680.0,
          streakDays: 34,
        },
      },
    },
  });

  console.log("✅ Seeded 4 Core Users (Admin, Faculty, Student, Maintenance Staff)");

  // 2. Create Campus Buildings
  const buildingsData = [
    {
      name: "Solar Science & Tech Complex",
      code: "BLD-SCI-01",
      category: "LABORATORY",
      grossFloorAreaSqM: 14500,
      yearBuilt: 2021,
      occupancyCapacity: 650,
      solarPanelsInstalled: true,
      rainwaterHarvesting: true,
      currentEnergyRating: "LEED Platinum",
    },
    {
      name: "Verdant Academic Quad",
      code: "BLD-ACAD-02",
      category: "ACADEMIC",
      grossFloorAreaSqM: 22000,
      yearBuilt: 2018,
      occupancyCapacity: 1200,
      solarPanelsInstalled: true,
      rainwaterHarvesting: true,
      currentEnergyRating: "LEED Gold",
    },
    {
      name: "EcoLiving Dormitory Cluster",
      code: "BLD-DORM-03",
      category: "DORMITORY",
      grossFloorAreaSqM: 11200,
      yearBuilt: 2023,
      occupancyCapacity: 450,
      solarPanelsInstalled: true,
      rainwaterHarvesting: false,
      currentEnergyRating: "Net-Zero Ready",
    },
    {
      name: "Central Memorial Library",
      code: "BLD-LIB-04",
      category: "LIBRARY",
      grossFloorAreaSqM: 16800,
      yearBuilt: 2012,
      occupancyCapacity: 900,
      solarPanelsInstalled: false,
      rainwaterHarvesting: false,
      currentEnergyRating: "EnergyStar 88",
    },
  ];

  for (const b of buildingsData) {
    const building = await prisma.building.upsert({
      where: { code: b.code },
      update: {},
      create: b,
    });

    // Create a smart meter for this building
    const meterSerial = `MTR-${b.code}-ELEC`;
    await prisma.utilityMeter.upsert({
      where: { meterSerial },
      update: {},
      create: {
        buildingId: building.id,
        meterType: "ELECTRICITY",
        meterSerial,
        locationDescription: "Main Switchgear Sub-panel A",
        unitOfMeasure: "kWh",
        status: "ACTIVE",
        lastTelemetryAt: new Date(),
      },
    });
  }

  console.log("✅ Seeded Campus Buildings and IoT Smart Meters");

  // 3. Create Green Quests
  const quests = [
    {
      title: "Campus Zero-Waste Week",
      description: "Divert all single-use plastics and log your compostable dining waste at smart bins.",
      category: "Waste Reduction",
      rewardEcoPoints: 120,
      co2ReductionEstKg: 8.5,
    },
    {
      title: "Dorm Energy Blackout Hour",
      description: "Power down non-essential lighting and desktop monitors between 8 PM - 9 PM on Thursdays.",
      category: "Energy Saving",
      rewardEcoPoints: 75,
      co2ReductionEstKg: 4.2,
    },
    {
      title: "Sustainable Transit Streak",
      description: "Walk, bike, or use the campus zero-emission shuttle 5 consecutive school days.",
      category: "Green Commute",
      rewardEcoPoints: 150,
      co2ReductionEstKg: 14.0,
    },
  ];

  for (const q of quests) {
    const quest = await prisma.greenQuest.create({
      data: q,
    });

    // Link a completion for student
    if (q.title.includes("Zero-Waste")) {
      await prisma.questCompletion.upsert({
        where: {
          questId_userId: {
            questId: quest.id,
            userId: studentUser.id,
          },
        },
        update: {},
        create: {
          questId: quest.id,
          userId: studentUser.id,
          proofNotes: "Logged 5 compost bin weigh-ins at the student union cafeteria.",
          status: "APPROVED",
          awardedPoints: 120,
        },
      });
    }
  }

  console.log("✅ Seeded Green Quests and Student Gamification Records");

  // 4. Create Sample Work Order
  await prisma.workOrder.upsert({
    where: { workOrderNumber: "WO-2026-081" },
    update: {},
    create: {
      workOrderNumber: "WO-2026-081",
      title: "Acoustic Leak in Science Complex Chilled Loop",
      description: "IoT sensor telemetry detected continuous 12.4 L/min flow during closed campus hours.",
      category: "PLUMBING_LEAK",
      priority: "HIGH",
      status: "ASSIGNED",
      locationDetails: "Sub-basement mechanical room near Pump Array 3",
      reportedById: studentUser.id,
      assignedToId: maintenanceUser.id,
      estimatedCarbonLossKg: 45.0,
    },
  });

  // 5. Create AI Insights
  await prisma.aiInsight.createMany({
    data: [
      {
        targetType: "CAMPUS_WIDE",
        title: "Solar Peak Load Shifting Opportunity",
        insightSummary: "Campus rooftop solar arrays generate 420 kW excess between 12:00 PM and 2:30 PM.",
        suggestedAction: "Pre-cool lecture halls in Science Complex and charge electric shuttle fleet during solar surplus.",
        confidenceScore: 0.94,
        projectedSavingsKwh: 3400.0,
        projectedSavingsUsd: 480.0,
        projectedCarbonReductionKg: 1850.0,
        status: "NEW",
      },
      {
        targetType: "BUILDING",
        title: "Nighttime Base-load Phantom Power Surge",
        insightSummary: "Verdant Academic Quad exhibits 38% higher baseline power draw between 1:00 AM and 4:00 AM compared to historical averages.",
        suggestedAction: "Trigger automated deep-sleep script for 8 computer labs and dispatch night facility audit.",
        confidenceScore: 0.89,
        projectedSavingsKwh: 1250.0,
        projectedSavingsUsd: 195.0,
        projectedCarbonReductionKg: 620.0,
        status: "NEW",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeded AI Insights and Work Orders");
  console.log("🎉 GreenCampus AI Database Seeding Complete!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
