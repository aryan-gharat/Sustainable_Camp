import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();

    let departments: any[] = [
      {
        id: "dept-01",
        code: "DEPT-RE-01",
        name: "Dept of Renewable Energy & Smart Grid Systems",
        headName: "Prof. Marcus Thorne",
        studentCount: 142,
        facultyCount: 12,
        annualEnergyBudgetCapKw: 35.0,
        currentPowerDrawKw: 28.4,
        carbonOffsetTonnes: 42.5,
        esgRating: "LEED A+",
        status: "OPTIMAL",
      },
      {
        id: "dept-02",
        code: "DEPT-ENV-02",
        name: "Dept of Environmental & Civil Engineering",
        headName: "Dr. Sarah Jenkins",
        studentCount: 210,
        facultyCount: 18,
        annualEnergyBudgetCapKw: 45.0,
        currentPowerDrawKw: 34.2,
        carbonOffsetTonnes: 38.0,
        esgRating: "LEED Gold",
        status: "OPTIMAL",
      },
      {
        id: "dept-03",
        code: "DEPT-CS-03",
        name: "School of Computer Science & AI Institute",
        headName: "Dr. Alan Turing",
        studentCount: 380,
        facultyCount: 28,
        annualEnergyBudgetCapKw: 65.0,
        currentPowerDrawKw: 58.6,
        carbonOffsetTonnes: 28.4,
        esgRating: "EnergyStar 92",
        status: "ATTENTION_NEEDED",
      },
      {
        id: "dept-04",
        code: "DEPT-BIO-04",
        name: "School of Biological & Microbial Sciences",
        headName: "Dr. Rosalind Franklin",
        studentCount: 185,
        facultyCount: 15,
        annualEnergyBudgetCapKw: 40.0,
        currentPowerDrawKw: 31.8,
        carbonOffsetTonnes: 32.1,
        esgRating: "LEED Platinum",
        status: "OPTIMAL",
      },
    ];

    return NextResponse.json({ success: true, departments });
  } catch (error) {
    console.error("Admin departments GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { name, code, headName, annualEnergyBudgetCapKw = 40.0 } = body;

    if (!name || !code) {
      return NextResponse.json({ error: "Department name and code are required." }, { status: 400 });
    }

    const newDept = {
      id: `dept-${Date.now()}`,
      code,
      name,
      headName: headName || "Unassigned",
      studentCount: 0,
      facultyCount: 1,
      annualEnergyBudgetCapKw: Number(annualEnergyBudgetCapKw) || 40.0,
      currentPowerDrawKw: 12.0,
      carbonOffsetTonnes: 0.0,
      esgRating: "Under Audit",
      status: "OPTIMAL",
    };

    return NextResponse.json({
      success: true,
      message: `Department '${name}' registered in institutional system.`,
      department: newDept,
    });
  } catch (error) {
    console.error("Admin department POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
