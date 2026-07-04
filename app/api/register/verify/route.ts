// app/api/register/verify/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import OtpCache from "@/models/otp.model";

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: "Email identity fields and OTP code lines are required." }, { status: 400 });
        }

        await connectToDatabase();
        const cleanEmail = email.trim().toLowerCase();

        // 1. Check if cache index exists or has already expired
        const cacheRecord = await OtpCache.findOne({ email: cleanEmail });
        if (!cacheRecord) {
            return NextResponse.json({ error: "Verification code expired or never initialized." }, { status: 400 });
        }

        // 2. Perform string match comparison check
        if (cacheRecord.otp !== otp.trim()) {
            return NextResponse.json({ error: "Invalid verification code entered. Please re-check." }, { status: 400 });
        }

        // 3. Move registration payload securely to permanent collection
        await User.create({
            name: cacheRecord.name,
            email: cacheRecord.email,
            password: cacheRecord.passwordHash,
            prakritiProfile: "Unknown" // Standard default configuration token
        });

        // 4. Wipe verification indexes clear out of temporary cache logs
        await OtpCache.deleteOne({ _id: cacheRecord._id });

        return NextResponse.json({ success: true, message: "Account verified and registered successfully!" }, { status: 201 });

    } catch (error: any) {
        console.error("[OTP Verification Endpoint Crash]:", error);
        return NextResponse.json({ error: "Server error encountered during authentication." }, { status: 500 });
    }
}