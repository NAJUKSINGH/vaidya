// app/community/page.tsx
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/post.model";
import CommunityClientPage from "./CommunityClientPage";

export default async function CommunityHubPage() {
    const session = await auth();
    const activeUserId = (session?.user as any)?.id; // Extract active user ID from session cookie
    
    await connectToDatabase();
    
    // Fetch all logs from newest to oldest
    const rawPosts = await Post.find().sort({ createdAt: -1 }).lean();

    const serializedPosts = rawPosts.map((post: any) => ({
        id: post._id.toString(),
        userId: post.userId ? post.userId.toString() : "", // 🚀 Forward creator's ID for client UI rendering match checks
        userName: post.userName,
        title: post.title,
        condition: post.condition,
        remedyUsed: post.remedyUsed || "",
        experience: post.experience,
        createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : new Date(post.createdAt).toISOString()
    }));

    return (
        <CommunityClientPage 
            isLoggedIn={!!session?.user} 
            activeUserId={activeUserId} // 🚀 Pass active user context down to enable trash bin icons
            initialPosts={serializedPosts} 
        />
    );
}