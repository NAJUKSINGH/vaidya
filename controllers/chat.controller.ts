// controllers/chatController.ts
import { askRAG } from "@/lib/rag";
import ChatSession from "@/models/chat.model";
import User from "@/models/user.model"; // 👈 Imported to enable body-type personalization

/**
 * 1. Process standard RAG embeddings matching text fragments and append to logs
 */
export async function processChatSubmission(userId: string, message: string, sessionId?: string) {
    // Fetch the user profile to look up their Ayurvedic body type
    const userProfile = await User.findById(userId);
    const userDosha = userProfile?.prakritiProfile || "Unknown";

    // Personalize the query payload with their Prakriti context for Astra DB / Gemini
    const personalizedQuery = `[User Prakriti: ${userDosha}] Patient Query: ${message}`;

    // Execute RAG lookup with personalized context
    const { answer } = await askRAG(personalizedQuery);
// Fix: Add "as const" at the end of the objects so TypeScript infers the exact literal values
const userMessageObj = { 
    role: "user" as const, 
    content: message, 
    timestamp: new Date() 
};

const assistantMessageObj = { 
    role: "assistant" as const, 
    content: answer, 
    timestamp: new Date() 
};

    if (sessionId) {
        // Fix: Used $each so both objects append cleanly as separate items in the array
        await ChatSession.findByIdAndUpdate(sessionId, {
            $push: { 
                messages: { 
                    $each: [userMessageObj, assistantMessageObj] 
                } 
            },
            $set: { updatedAt: new Date() }
        });
        return { answer, sessionId };
    } else {
        const newSession = await ChatSession.create({
            userId,
            title: message.slice(0, 30) + "...",
            messages: [userMessageObj, assistantMessageObj],
            updatedAt: new Date()
        });
        return { answer, sessionId: newSession._id.toString() };
    }
}

/**
 * 2. Retrieves ALL past chat session summaries for a specific user (for a sidebar history view)
 */
export async function getAllUserSessions(userId: string) {
    // Return only the title and update timestamp, excluding full message blocks for performance
    return await ChatSession.find({ userId })
        .select("title updatedAt")
        .sort({ updatedAt: -1 }); 
}

/**
 * 3. Retrieves the full message logs of ONE specific chat session
 */
export async function getSingleSessionLogs(sessionId: string, userId: string) {
    const session = await ChatSession.findOne({ _id: sessionId, userId });
    if (!session) {
        throw new Error("Chat history stream not found or access denied.");
    }
    return session;
}