import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createClerkClient } from '@clerk/backend';
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Create Clerk client inside the function to ensure env vars are loaded
        const clerkClient = createClerkClient({ 
            secretKey: process.env.CLERK_SECRET_KEY 
        });

        // Get session token from Clerk cookie, query parameter (for SSE EventSource), or Authorization header
        const sessionToken = req.cookies?.__session || 
                            req.cookies?.__clerk_db_jwt || 
                            req.query?.token ||
                            req.header("Authorization")?.replace("Bearer ", "");

        if (!sessionToken) {
            throw new ApiError(401, "Access token is required");
        }

        // Decode JWT to extract user ID
        let clerkUserId;
        
        try {
            // Clerk tokens are JWTs, decode to get the user ID
            const base64Url = sessionToken.split('.')[1];
            if (base64Url) {
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString().split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                
                const payload = JSON.parse(jsonPayload);
                clerkUserId = payload.sub;
            }
        } catch (error) {
            console.error('Token decoding error:', error.message);
            throw new ApiError(401, "Invalid or expired session");
        }

        if (!clerkUserId) {
            throw new ApiError(401, "Invalid token");
        }

        // Find or create user in DB based on Clerk ID
        let user = await User.findOne({ clerkId: clerkUserId });
        if (!user) {
            // Get email from Clerk API
            const clerkUser = await clerkClient.users.getUser(clerkUserId);
            const email = clerkUser.emailAddresses?.[0]?.emailAddress || '';
            
            // Sync new Clerk user to DB (minimal data)
            user = await User.create({
                clerkId: clerkUserId,
                email: email,
                password: null,  // No password for Clerk users
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(401).json(new ApiError(401, "Authentication failed: " + error.message));
    }
});