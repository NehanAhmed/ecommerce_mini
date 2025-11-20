'use server';
import { currentUser } from "@clerk/nextjs/server"

export const getCurrentUser = async () => {
    try {
        const user = await currentUser()
        
        if (!user) {
            console.warn("No user found - user may not be authenticated");
            return null;
        }
        
        return {
            firstName: user?.firstName || "Guest",
            email: user?.primaryEmailAddress?.emailAddress || "",
            userId: user?.id,
            imageUrl: user?.imageUrl,
        };
    } catch (error) {
        console.error("Error fetching current user:", error);
        // Return null instead of undefined to handle unauthenticated users gracefully
        return null;
    }
}