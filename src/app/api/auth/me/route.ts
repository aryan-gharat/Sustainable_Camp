import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, AUTH_COOKIE_NAME } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { Role } from "@/types/auth";

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

    // Try to enrich from database
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
      // Return JWT payload if DB is offline or mock user
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        role: payload.role as Role,
        department: payload.department || null,
        avatarUrl: null,
        ecoPoints: payload.role === "STUDENT" ? 340 : 120,
        carbonSaved: 42.5,
      },
    });
  } catch (error) {
    console.error("Error reading session:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
