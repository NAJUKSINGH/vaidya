// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Use the lightweight configurations object to instantiate edge middleware guards
export const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
    const userIsAuthenticated = !!req.auth;
    const targetsDashboardPath = req.nextUrl.pathname.startsWith("/chat");

    if (targetsDashboardPath && !userIsAuthenticated) {
        return Response.redirect(new URL("/auth", req.nextUrl)); // Adjusted to match your /auth login page route
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};