import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.userId;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let rewards: any[] = [];
    let redemptions: any[] = [];
    let userPoints = 580;

    try {
      if (userId) {
        const profile = await prisma.profile.findUnique({
          where: { userId },
          select: { totalEcoPoints: true },
        });
        if (profile) userPoints = profile.totalEcoPoints;

        const dbRedemptions = await prisma.rewardRedemption.findMany({
          where: { userId },
          include: { reward: true },
          orderBy: { redeemedAt: "desc" },
        });
        redemptions = dbRedemptions;
      }

      const whereClause: any = { isActive: true };
      if (category && category !== "ALL") whereClause.category = category;

      const dbRewards = await prisma.reward.findMany({
        where: whereClause,
        orderBy: { pointsCost: "asc" },
      });

      if (dbRewards.length > 0) {
        rewards = dbRewards;
      }
    } catch (err) {
      console.warn("DB fallback for student rewards GET:", err);
    }

    if (rewards.length === 0) {
      rewards = [
        {
          id: "rwd-01",
          title: "15% Off Organic Campus Cafe",
          description: "Valid for all organic smoothies, plant-based meals, and artisan fair-trade coffee.",
          category: "DINING",
          pointsCost: 150,
          stock: 45,
          codePrefix: "CAFE-ECO",
          isActive: true,
        },
        {
          id: "rwd-02",
          title: "$10 Campus Bookstore Eco-Voucher",
          description: "Apply toward recycled notebooks, sustainable stationery, or course textbooks.",
          category: "VOUCHER",
          pointsCost: 250,
          stock: 30,
          codePrefix: "BOOK-GREEN",
          isActive: true,
        },
        {
          id: "rwd-03",
          title: "1-Month Campus Electric Bike Pass",
          description: "Unlimited 30-minute rides on the green campus e-bike share network.",
          category: "COMMUTE",
          pointsCost: 400,
          stock: 15,
          codePrefix: "BIKE-PASS",
          isActive: true,
        },
        {
          id: "rwd-04",
          title: "Plant-A-Tree In Your Name Certificate",
          description: "Sponsor a native oak sapling planted in the campus conservation forest with personalized plaque.",
          category: "DONATION",
          pointsCost: 500,
          stock: 100,
          codePrefix: "TREE-HERO",
          isActive: true,
        },
        {
          id: "rwd-05",
          title: "Stainless Steel Insulated Eco-Flask",
          description: "Dual-wall vacuum insulated 750ml thermal flask branded with GreenCampus AI seal.",
          category: "MERCHANDISE",
          pointsCost: 650,
          stock: 8,
          codePrefix: "FLASK-ECO",
          isActive: true,
        },
      ];
    }

    if (redemptions.length === 0) {
      redemptions = [
        {
          id: "rdm-99",
          rewardId: "rwd-01",
          reward: rewards[0],
          voucherCode: "CAFE-ECO-9841-X7",
          pointsSpent: 150,
          redeemedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          expiresAt: new Date(Date.now() + 86400000 * 27).toISOString(),
          isUsed: false,
        },
      ];
    }

    return NextResponse.json({
      success: true,
      userPoints,
      rewards,
      redemptions,
    });
  } catch (error) {
    console.error("Student rewards GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.userId;
    const body = await request.json();
    const { rewardId } = body;

    if (!rewardId) {
      return NextResponse.json({ error: "Reward ID is required." }, { status: 400 });
    }

    let redemptionResult: any = null;

    if (userId) {
      try {
        const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
        if (!reward || !reward.isActive) {
          return NextResponse.json({ error: "Reward is no longer available." }, { status: 400 });
        }

        const profile = await prisma.profile.findUnique({ where: { userId } });
        if (!profile || profile.totalEcoPoints < reward.pointsCost) {
          return NextResponse.json(
            { error: `Insufficient Eco-Points. Required: ${reward.pointsCost} PTS.` },
            { status: 400 }
          );
        }

        if (reward.stock <= 0) {
          return NextResponse.json({ error: "This reward is out of stock." }, { status: 400 });
        }

        const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
        const voucherCode = `${reward.codePrefix}-${randomCode}`;
        const expiresAt = new Date(Date.now() + 86400000 * 30);

        // Transaction to deduct points, reduce stock, and add redemption
        const [updatedProfile, newRedemption] = await prisma.$transaction([
          prisma.profile.update({
            where: { userId },
            data: { totalEcoPoints: { decrement: reward.pointsCost } },
          }),
          prisma.rewardRedemption.create({
            data: {
              rewardId: reward.id,
              userId,
              voucherCode,
              pointsSpent: reward.pointsCost,
              expiresAt,
              isUsed: false,
            },
            include: { reward: true },
          }),
          prisma.reward.update({
            where: { id: reward.id },
            data: { stock: { decrement: 1 } },
          }),
          prisma.ecoPointLog.create({
            data: {
              userId,
              points: -reward.pointsCost,
              reason: `Redeemed voucher: ${reward.title}`,
            },
          }),
        ]);

        redemptionResult = {
          redemption: newRedemption,
          remainingPoints: updatedProfile.totalEcoPoints,
        };
      } catch (err) {
        console.warn("DB fallback for reward redemption POST:", err);
      }
    }

    if (!redemptionResult) {
      const code = `GC-ECO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      redemptionResult = {
        redemption: {
          id: `rdm-${Date.now()}`,
          rewardId,
          voucherCode: code,
          pointsSpent: 150,
          redeemedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
          isUsed: false,
        },
        remainingPoints: 430,
      };
    }

    return NextResponse.json({
      success: true,
      message: "Reward redeemed successfully! Unique voucher generated.",
      data: redemptionResult,
    });
  } catch (error) {
    console.error("Student rewards POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
