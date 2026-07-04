// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/post.model";

/**
 * 🚀 POST: Creates a new community experience log
 */
export async function POST(req: Request) {
    try {
        // 1. Verify active user session state
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Authentication required to share experiences." }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const userName = session.user.name || "Anonymous Seeker";

        // 2. Extract input variables from body
        const { title, condition, remedyUsed, experience } = await req.json();

        if (!title || !condition || !experience) {
            return NextResponse.json({ error: "Missing required fields: Title, Condition, and Experience are mandatory." }, { status: 400 });
        }

        await connectToDatabase();

        // 3. Instantiate and persist model payload records
        const freshPost = await Post.create({
            userId,
            userName,
            title: title.trim(),
            condition: condition.trim(),
            remedyUsed: remedyUsed ? remedyUsed.trim() : "",
            experience: experience.trim(),
            upvotes: [],
            createdAt: new Date()
        });

        // Convert the Mongoose document to a plain object matching client requirements
        const responseData = {
            id: freshPost._id.toString(),
            userName: freshPost.userName,
            title: freshPost.title,
            condition: freshPost.condition,
            remedyUsed: freshPost.remedyUsed,
            experience: freshPost.experience,
            createdAt: freshPost.createdAt.toISOString()
        };

        return NextResponse.json(responseData, { status: 201 });
    } catch (error: any) {
        console.error("[Post Creation API Error]:", error);
        return NextResponse.json({ error: "Internal server breakdown saving post parameters." }, { status: 500 });
    }
}