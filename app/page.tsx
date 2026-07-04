// app/page.tsx
import { auth } from "@/auth";
import LandingPageClient from "./page/LandingPageClient";
import { getLandingPageFeed } from "@/controllers/feed.controller"; // Your backend MongoDB fetcher

export default async function Page() {
    const session = await auth();
    let publicPosts = [];
    
    try {
        publicPosts = await getLandingPageFeed();
    } catch (e) {
        console.error("Failed to load community feed logs", e);
    }

    // Convert Mongoose documents to plain JSON array
    const serializedPosts = publicPosts.map((post: any) => ({
        id: post._id.toString(),
        userName: post.userName,
        title: post.title,
        condition: post.condition,
        experience: post.experience,
        createdAt: post.createdAt.toISOString()
    }));

    return (
        <LandingPageClient 
            isLoggedIn={!!session?.user} 
            communityPosts={serializedPosts} 
        />
    );
}