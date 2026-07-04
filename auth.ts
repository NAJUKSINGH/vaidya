// auth.ts
import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Credentials from "next-auth/providers/credentials";
import clientPromise from "@/lib/db";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config"; // 👈 Import base config

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig, // Spread the base configuration parameters
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { type: "email" },
                password: { type: "password" }
            },
            async authorize(credentials) {
                await connectToDatabase();
                
                const user = await User.findOne({ email: credentials?.email });
                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(credentials.password as string, user.password);
                if (!isValid) return null;

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    prakritiProfile: user.prakritiProfile
                };
            }
        })
    ]
});