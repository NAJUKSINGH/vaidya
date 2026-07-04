// app/api/posts/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/post.model";

/**
 * 🗑️ DELETE: Wipes out a specific post if ownership matches
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) { // 🚀 1. Typed params as a Promise
    try {
        // Verify user authentication status
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized operation sequence detected." }, { status: 401 });
        }

        const activeUserId = (session.user as any).id;

        // 🚀 2. UNWRAP THE PROMISE PARAMS TARGET OBJECT HERE
        const resolvedParams = await params; 
        const targetPostId = resolvedParams.id;

        await connectToDatabase();

        // 3. Fetch targeted document to check validation permissions
        const existingPost = await Post.findById(targetPostId);
        
        if (!existingPost) {
            return NextResponse.json({ error: "Target community post record not found." }, { status: 404 });
        }

        // 4. Security Guard Rule: Ensure only the creator can drop this document
        if (existingPost.userId.toString() !== activeUserId) {
            return NextResponse.json({ error: "Forbidden: You are not authorized to remove another member's post logs." }, { status: 403 });
        }

        // 5. Fire execution query
        await Post.findByIdAndDelete(targetPostId);

        return NextResponse.json({ message: "Community experience log dropped successfully.", id: targetPostId }, { status: 200 });
        
    } catch (error: any) {
        console.error("[Post Deletion API Error]:", error);
        return NextResponse.json({ error: "Internal processing crash while clearing database records." }, { status: 500 });
    }
}