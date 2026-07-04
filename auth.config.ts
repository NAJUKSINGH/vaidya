// auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    providers: [], // We will fill this with credentials inside auth.ts
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.prakritiProfile = (user as any).prakritiProfile;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id;
                (session.user as any).prakritiProfile = token.prakritiProfile;
            }
            return session;
        }
    }
} satisfies NextAuthConfig;