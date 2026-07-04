// app/api/user/profile/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserProfile, updateUserPrakriti } from "@/controllers/user.controllers";

/**
 * GET: Fetches the active user's current profile data
 */
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized access denied." }, { status: 401 });
        }

        await connectToDatabase();
        const activeUserId = (session.user as any).id;
        
        // Delegate to userController
        const profile = await getUserProfile(activeUserId);
        return NextResponse.json(profile);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
    }
}

/**
 * POST/PUT: Updates the user's Dosha state after submitting a quiz
 */
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized access denied." }, { status: 401 });
        }

        await connectToDatabase();
        const { dosha } = await req.json();

        // Basic payload structural validation
        if (!dosha || !["Vata", "Pitta", "Kapha"].includes(dosha)) {
            return NextResponse.json({ error: "Invalid or missing Dosha attribute." }, { status: 400 });
        }

        const activeUserId = (session.user as any).id;
        
        // Delegate to userController
        const updatedProfile = await updateUserPrakriti(activeUserId, dosha);
        
        return NextResponse.json({ 
            success: true, 
            message: "Prakriti profile updated successfully.",
            user: updatedProfile 
        });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
    }
}