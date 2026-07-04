// models/otp.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Define a strict interface for the document structure fields
export interface IOtpCache {
    email: string;
    name: string;
    passwordHash: string;
    otp: string;
    createdAt?: Date;
}

const OtpCacheSchema = new Schema<IOtpCache>({
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 } // ⏳ Auto-deletes completely after 10 minutes
});

// 2. Explicitly bind the model to the IOtpCache interface structure definition
const OtpCache: Model<IOtpCache> = mongoose.models.OtpCache || mongoose.model<IOtpCache>("OtpCache", OtpCacheSchema);

export default OtpCache;