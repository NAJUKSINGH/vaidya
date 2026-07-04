import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    name?: string;
    email: string;
    password?: string;
    prakritiProfile: "Vata" | "Pitta" | "Kapha" | "Unknown";
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    prakritiProfile: {
        type: String,
        enum: ["Vata", "Pitta", "Kapha", "Unknown"],
        default: "Unknown"
    },
    updatedAt: { type: Date, default: Date.now }
});

const User: Model<IUser> =
    (mongoose.models.User as Model<IUser>) ||
    mongoose.model<IUser>("User", UserSchema);

export default User;