import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prebackend from "@/lib/prebackend";

export async function GET() {
  try {
    const session = await getSession();
    const departments = prebackend.getAllDepartments();
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

    const newDept = prebackend.createDepartment({
      name,
      code,
      headName,
      annualEnergyBudgetCapKw: Number(annualEnergyBudgetCapKw) || 40.0,
    });

    return NextResponse.json({
      success: true,
      message: `Department '${name}' registered and stored in institutional directory.`,
      department: newDept,
    });
  } catch (error) {
    console.error("Admin department POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
