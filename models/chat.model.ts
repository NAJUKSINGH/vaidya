import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Message interface
export interface IMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

// 2. Chat session interface
export interface IChatSession extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    messages: IMessage[];
    updatedAt: Date;
}

// 3. Schema
const ChatSessionSchema = new Schema<IChatSession>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "New Ayurvedic Consultation" },
    messages: [
        {
            role: { type: String, enum: ["user", "assistant"], required: true },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ],
    updatedAt: { type: Date, default: Date.now }
});

// 4. Explicit model type
const ChatSession: Model<IChatSession> =
    (mongoose.models.ChatSession as Model<IChatSession>) ||
    mongoose.model<IChatSession>("ChatSession", ChatSessionSchema);

export default ChatSession;