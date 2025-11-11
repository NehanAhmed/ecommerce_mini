'use server';
import { currentUser } from "@clerk/nextjs/server"

export const getCurrentUser = async () => {
    try {
        const user = await currentUser()
        return [
            user?.firstName,
            user?.primaryEmailAddress?.emailAddress,
        ];
    } catch (error) {
        console.error("Error fetching current user:", error);
    }
}