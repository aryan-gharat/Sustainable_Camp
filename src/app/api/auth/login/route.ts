import { NextRequest, NextResponse } from "next/server";
import { signJWT, AUTH_COOKIE_NAME } from "@/lib/jwt";
import { comparePassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@/types/auth";
import { getRoleDefaultPath } from "@/lib/rbac";

// Preset Demo accounts for rapid evaluation & local development
const DEMO_USERS: Record<
  string,
  {
    id: string;
    email: string;
    name: string;
    role: Role;
    department: string;
    passwordPlain: string;
  }
> = {
  "admin@greencampus.ai": {
    id: "demo-admin-01",
    email: "admin@greencampus.ai",
    name: "Dr. Elena Vance (Campus VP & Sustainability Director)",
    role: "ADMIN",
    department: "Executive Sustainability Board",
    passwordPlain: "green2026!",
  },
  "student@greencampus.ai": {
    id: "demo-student-01",
    email: "student@greencampus.ai",
    name: "Aiden Sharma (Eco-Ambassador)",
    role: "STUDENT",
    department: "Environmental Engineering '27",
    passwordPlain: "green2026!",
  },
  "faculty@greencampus.ai": {
    id: "demo-faculty-01",
    email: "faculty@greencampus.ai",
    name: "Prof. Marcus Thorne",
    role: "FACULTY",
    department: "Renewable Energy & IoT Department",
    passwordPlain: "green2026!",
  },
  "maintenance@greencampus.ai": {
    id: "demo-maintenance-01",
    email: "maintenance@greencampus.ai",
    name: "Carlos Mendez (Lead Facilities Specialist)",
    role: "MAINTENANCE_STAFF",
    department: "Campus Facilities & IoT Operations",
    passwordPlain: "green2026!",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check for Demo user accounts (guaranteed instant access)
    const demoUser = DEMO_USERS[normalizedEmail];
    if (demoUser && password === demoUser.passwordPlain) {
      const token = await signJWT({
        userId: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        department: demoUser.department,
      });

      const response = NextResponse.json({
        success: true,
        message: "Demo authentication successful",
        user: {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          department: demoUser.department,
        },
        defaultRedirect: getRoleDefaultPath(demoUser.role),
      });

      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // 2. Query Prisma database for registered user
    try {
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Invalid credentials. Please verify your email or password." },
          { status: 401 }
        );
      }

      if (!user.isActive) {
        return NextResponse.json(
          { error: "This campus account has been deactivated. Contact an administrator." },
          { status: 403 }
        );
      }

      const isValidPassword = await comparePassword(password, user.passwordHash);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Invalid credentials. Please verify your email or password." },
          { status: 401 }
        );
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      const token = await signJWT({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
        department: user.department,
      });

      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          avatarUrl: user.avatarUrl,
        },
        defaultRedirect: getRoleDefaultPath(user.role as Role),
      });

      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    } catch (dbError) {
      console.error("Database connection error in login:", dbError);
      return NextResponse.json(
        {
          error:
            "Could not connect to PostgreSQL database. Please ensure PostgreSQL is running or use the provided 1-click Demo credentials below.",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
