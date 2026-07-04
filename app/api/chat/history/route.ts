// app/api/chat/history/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { getAllUserSessions, getSingleSessionLogs } from "@/controllers/chat.controller";

/**
 * GET: Fetches chat sessions based on parameters
 * - URL target: /api/chat/history -> Pulls sidebar items list
 * - URL target: /api/chat/history?id=SESSION_ID -> Pulls full thread details
 */
export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Access denied. Action requires authorization." }, { status: 401 });
        }

        await connectToDatabase();
        const activeUserId = (session.user as any).id;

        // Parse search params to see if they are requesting a specific conversation thread
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("id");

        if (sessionId) {
            // Delegate thread detail pulling to controller
            const fullThread = await getSingleSessionLogs(sessionId, activeUserId);
            return NextResponse.json(fullThread);
        }

        // Default: Delegate general history summary fetch to controller
        const historyList = await getAllUserSessions(activeUserId);
        return NextResponse.json(historyList);

    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "History extraction crash." }, { status: 500 });
    }
}