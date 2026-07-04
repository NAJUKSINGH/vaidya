// controllers/userController.ts
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

/**
 * Retrieves a user's profile details from MongoDB
 */
export async function getUserProfile(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new Error("User profile record not found.");
    return user;
}

/**
 * Updates the user's Prakriti (Dosha) profile based on their questionnaire results
 */
export async function updateUserPrakriti(userId: string, dosha: "Vata" | "Pitta" | "Kapha") {
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { prakritiProfile: dosha, updatedAt: new Date() } },
        { new: true }
    ).select("-password");

    if (!updatedUser) throw new Error("Failed to update user profile. User not found.");
    return updatedUser;
}

/**
 * Registers a brand new user account in MongoDB
 */
export async function registerNewAccount(email: string, passwordSecret: string, name?: string) {
    // 1. Check if the user already exists
    const legacyAccountExists = await User.findOne({ email });
    if (legacyAccountExists) {
        throw new Error("An account with this email already exists.");
    }

    // 2. Hash the password securely
    const secureHashedPassword = await bcrypt.hash(passwordSecret, 12);

    // 3. Create the new user profile document
    const freshUserRecord = await User.create({
        email,
        name,
        password: secureHashedPassword,
        prakritiProfile: "Unknown",
        updatedAt: new Date()
    });

    return { 
        id: freshUserRecord._id.toString(), 
        email: freshUserRecord.email,
        name: freshUserRecord.name 
    };
}