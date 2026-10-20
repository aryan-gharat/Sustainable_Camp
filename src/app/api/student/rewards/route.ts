import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import prebackend from "@/lib/prebackend";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.userId || "usr-stu-01";
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;

    const rewards = prebackend.getAllRewards({ category });
    const redemptions = prebackend.getRedemptionsForUser(userId);
    const profile = prebackend.getProfileByUserId(userId);
    const userPoints = profile ? profile.totalEcoPoints : 580;

    return NextResponse.json({
      success: true,
      rewards,
      redemptions,
      userPoints,
    });
  } catch (error) {
    console.error("Student rewards GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.userId || "usr-stu-01";
    const body = await request.json();
    const { rewardId } = body;

    if (!rewardId) {
      return NextResponse.json({ error: "Reward ID is required." }, { status: 400 });
    }

    try {
      // Redeem and persist voucher in Pre-Backend store
      const result = prebackend.redeemReward(rewardId, userId);

      // Optional background sync with Prisma if online
      try {
        await prisma.profile.update({
          where: { userId },
          data: { totalEcoPoints: { decrement: result.redemption.pointsSpent } },
        });
        await prisma.rewardRedemption.create({
          data: {
            id: result.redemption.id,
            rewardId,
            userId,
            voucherCode: result.redemption.voucherCode,
            pointsSpent: result.redemption.pointsSpent,
            expiresAt: new Date(result.redemption.expiresAt),
            isUsed: false,
          },
        });
        await prisma.reward.update({
          where: { id: rewardId },
          data: { stock: { decrement: 1 } },
        });
        await prisma.ecoPointLog.create({
          data: {
            userId,
            points: -result.redemption.pointsSpent,
            reason: `Redeemed voucher: ${result.redemption.reward.title}`,
          },
        });
      } catch {
        // Prisma offline
      }

      return NextResponse.json({
        success: true,
        message: "Reward redeemed successfully! Unique voucher generated and saved.",
        data: result,
      });
    } catch (redeemErr: any) {
      return NextResponse.json(
        { error: redeemErr.message || "Could not redeem reward." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Student rewards POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
