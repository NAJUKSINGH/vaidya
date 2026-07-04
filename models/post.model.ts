import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
    userId: mongoose.Types.ObjectId;
    userName: string;
    title: string;
    condition: string;
    remedyUsed: string;
    experience: string;
    upvotes: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const PostSchema = new Schema<IPost>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    title: { type: String, required: true },
    condition: { type: String, required: true },
    remedyUsed: { type: String, required: true },
    experience: { type: String, required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now }
});

const Post: Model<IPost> =
    mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;