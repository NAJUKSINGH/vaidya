// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth"; // NextAuth session extractor
import { connectToDatabase } from "@/lib/mongodb";
import { redis } from "@/lib/redis"; // ⚡ Imported Redis Client
import { generateCacheKey } from "@/lib/cacheUtils"; // ⚡ Imported Key Generator
import { processChatSubmission } from "@/controllers/chat.controller";

export async function POST(req: Request) {
    try {
        // 1. Secure the route with NextAuth session guard
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { error: "Access denied. Please log in first." }, 
                { status: 401 }
            );
        }

        // Parse message and an optional sessionId from the request body
        const { message, sessionId } = await req.json();

        // Keep your original verification logic intact
        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // 2. Immediate Safety Guardrail Check
        const emergencyTriggers = ["chest pain", "breathing issue", "heart attack", "poisoning"];
        if (emergencyTriggers.some(trigger => message.toLowerCase().includes(trigger))) {
            return NextResponse.json({
                answer: `🚨 **EMERGENCY NOTICE**\n\nYour symptoms indicate a potentially critical situation.\n- Do not attempt home remedies for acute distress.\n- Please contact your nearest emergency healthcare services (e.g., 102 / 911) immediately.`
            });
        }

        // 🚀 3. REDIS CACHE LOOKUP 
        // We look up the query based on the message string. 
        const cacheKey = generateCacheKey(message);
        
        console.time("[Redis Latency Check]");
        const cachedAnswer = await redis.get<string>(cacheKey);
        console.timeEnd("[Redis Latency Check]");

        if (cachedAnswer) {
            console.log(`[⚡ Cache HIT] Serving response directly from Upstash Redis: ${cacheKey}`);
            return NextResponse.json({ 
                answer: cachedAnswer, 
                sessionId: sessionId || "cached_session",
                cached: true // Telemetry marker so your frontend knows it came from cache
            });
        }

        console.log(`[🐢 Cache MISS] Route proceeding to RAG vector lookups and Gemini API execution...`);

        // 4. Open our application database connection (Only hit if cache misses)
        await connectToDatabase();

        // Retrieve user ID from the session cookie
        const activeUserId = (session.user as any).id;

        // 5. Delegate the RAG lookup and MongoDB log saving to the controller
        const result = await processChatSubmission(activeUserId, message, sessionId);

        // 🚀 6. PERSIST FRESH RESPONSES TO THE CACHE FOR 24 HOURS (86400 Seconds)
        if (result && result.answer) {
            await redis.set(cacheKey, result.answer, { ex: 86400 });
            console.log(`[💾 Redis Save] Successfully cached answer for key: ${cacheKey}`);
        }

        // Return the clean result object containing { answer, sessionId }
        return NextResponse.json(result);

    } catch (error) {
        console.error("Chat API Error:", error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}