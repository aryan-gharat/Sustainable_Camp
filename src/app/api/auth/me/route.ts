import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, AUTH_COOKIE_NAME } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { Role } from "@/types/auth";
import prebackend from "@/lib/prebackend";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    // 1. Enrich from Pre-Backend Store
    const storedUser =
      prebackend.getUserById(payload.userId) ||
      prebackend.getUserByEmail(payload.email);

    if (storedUser) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: storedUser.id,
          email: storedUser.email,
          name: storedUser.name,
          role: storedUser.role,
          department: storedUser.department,
          avatarUrl: storedUser.avatarUrl,
          ecoPoints: storedUser.profile?.totalEcoPoints ?? (payload.role === "STUDENT" ? 580 : 120),
          carbonSaved: storedUser.profile?.carbonSavedKg ?? 42.5,
          streakDays: storedUser.profile?.streakDays ?? 1,
        },
      });
    }

    // 2. Fallback to Prisma if available
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          department: true,
          avatarUrl: true,
          profile: {
            select: {
              totalEcoPoints: true,
              carbonSavedKg: true,
            },
          },
        },
      });

      if (dbUser) {
        return NextResponse.json({
          authenticated: true,
          user: {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            department: dbUser.department,
            avatarUrl: dbUser.avatarUrl,
            ecoPoints: dbUser.profile?.totalEcoPoints ?? 0,
            carbonSaved: dbUser.profile?.carbonSavedKg ?? 0,
          },
        });
      }
    } catch {
      // Prisma offline
    }

    // Default payload fallback
    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        role: payload.role as Role,
        department: payload.department || null,
        avatarUrl: null,
        ecoPoints: payload.role === "STUDENT" ? 580 : 120,
        carbonSaved: 42.5,
      },
    });
  } catch (error) {
    console.error("Error reading session:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
