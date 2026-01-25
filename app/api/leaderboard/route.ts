import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Submission from "@/models/Submission";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Aggregate scores per user
        // Note: For simplicity, we just sum up max score per challenge (to avoid duplicate points for same challenge)
        // More robust: Group by user and challenge, take max score, then sum.

        const leaderboard = await Submission.aggregate([
            { $match: { status: "accepted" } },
            // Group by User AND Challenge first to get unique challenges solved
            {
                $group: {
                    _id: { userId: "$userId", challengeId: "$challengeId" },
                    score: { $max: "$score" }
                }
            },
            // Then group by User to sum total points
            {
                $group: {
                    _id: "$_id.userId",
                    totalScore: { $sum: "$score" },
                    solvedCount: { $sum: 1 }
                }
            },
            { $sort: { totalScore: -1 } },
            { $limit: 10 }
        ]);

        // Populate User Details manually since aggregate doesn't support simple populate
        const populatedLeaderboard = await User.populate(leaderboard, { path: "_id", select: "username name" });

        return NextResponse.json(populatedLeaderboard.map((entry: any) => ({
            userId: entry._id._id,
            username: entry._id.username,
            name: entry._id.name,
            totalScore: entry.totalScore,
            solvedCount: entry.solvedCount
        })));

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}
