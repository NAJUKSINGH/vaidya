// app/profile/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import { getAllUserSessions } from "@/controllers/chat.controller";
import ProfileDashboardClient from "./ProfileDashboardClient"; // We'll house the clean sub-layouts here

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user) redirect("/auth");

    await connectToDatabase();
    const activeUserId = (session.user as any).id;

    const [activeUser, pastSessions] = await Promise.all([
        User.findById(activeUserId),
        getAllUserSessions(activeUserId)
    ]);

    if (!activeUser) redirect("/auth");

    // Convert Mongoose documents into plain serializable arrays for the Client layer safely
    const serializedSessions = pastSessions.map((chat: any) => ({
    id: chat._id.toString(),
    title: chat.title,
    updatedAt: new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC"
    }).format(chat.updatedAt)
}));

    return (
        <ProfileDashboardClient 
            user={{
                name: activeUser.name,
                email: activeUser.email,
                prakriti: activeUser.prakritiProfile
            }} 
            initialSessions={serializedSessions} 
        />
    );
}