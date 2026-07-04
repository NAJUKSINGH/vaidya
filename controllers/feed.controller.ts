// controllers/feedController.ts
import Post from "@/models/post.model";
import { connectToDatabase } from "@/lib/mongodb";

export async function getLandingPageFeed() {
    await connectToDatabase();
    // Fetch the latest 3 or 4 community experiences to display on the landing page
    return await Post.find()
        .sort({ createdAt: -1 })
        .limit(4)
        .lean();
}