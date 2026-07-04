// app/api/register/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import OtpCache from "@/models/otp.model";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

// Initialize Resend Client instance using your saved env token
const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "All profile registration entries are mandatory." }, { status: 400 });
        }

        const cleanEmail = email.trim().toLowerCase();
        if (!EMAIL_REGEX.test(cleanEmail)) {
            return NextResponse.json({ error: "Please insert a structured valid email address." }, { status: 400 });
        }

        await connectToDatabase();

        // Check if user is already registered inside our permanent collection
        const userExists = await User.findOne({ email: cleanEmail });
        if (userExists) {
            return NextResponse.json({ error: "An account with this email address already exists." }, { status: 400 });
        }

        // 1. Generate 6-Digit random token and hash password
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 12);

        // 2. Clear out any previous pending signup cache logs for this specific address
        await OtpCache.deleteMany({ email: cleanEmail });
        
        // 3. Cache inputs into temporary TTL model
        await OtpCache.create({
            email: cleanEmail,
            name: name.trim(),
            passwordHash: hashedPassword,
            otp: generatedOtp
        });

        // 4. Dispatch transaction payload using Resend REST wrapper
        const { data, error } = await resend.emails.send({
            from: "Vaidya Onboarding <onboarding@resend.dev>",
            to: [cleanEmail], // Remember: Must be your own Resend login account email during sandbox testing!
            subject: "🌿 Confirm Your Vaidya Account OTP Verification Code",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #E8DCC8; background-color: #FEFCF7; border-radius: 12px;">
                    <h2 style="color: #1B4332; font-family: serif; text-align: center;">Welcome to Vaidya</h2>
                    <p style="color: #5C5442; font-size: 15px; line-height: 1.5;">Thank you for registering. Please apply the 6-digit verification code below to activate your account parameters. This code is active for 10 minutes:</p>
                    <div style="background-color: #F5EDD8; border: 1px dashed #B5631A; padding: 16px; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; color: #1B4332; margin: 24px 0; border-radius: 8px;">
                        ${generatedOtp}
                    </div>
                    <p style="color: #8C7B64; font-size: 12px; text-align: center; margin-top: 24px;">If you didn't trigger this sign-up prompt, you can safely disregard this digital delivery.</p>
                </div>
            `
        });

        if (error) {
            console.error("[Resend API Dispatch Error]:", error);
            return NextResponse.json({ error: "Failed to securely deliver verification email." }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Verification code transmitted successfully." });

    } catch (err: any) {
        console.error("Registration Error:", err);
        return NextResponse.json({ error: "Internal processing server registration breakdown." }, { status: 500 });
    }
}