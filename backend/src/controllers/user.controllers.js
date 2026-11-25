import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiReponse.js";
import { User } from "../models/user.model.js";
import { Report } from "../models/report.model.js"
import { Notification } from "../models/notification.model.js";;
import { uploadOnCloudinary, getUploadSignature } from "../utils/cloudinary.js";
import {appRedis} from "../utils/redis.js";  

import path from 'path';
import fs from 'fs';
import { createClerkClient } from '@clerk/backend';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// Webhook to handle Clerk user events
const handleClerkWebhook = asyncHandler(async (req, res) => {
    const { type, data } = req.body;
    
    if (type === 'user.created') {
        const { id, email_addresses } = data;
        const email = email_addresses[0]?.email_address;
        
        // Create or update user in DB
        await User.findOneAndUpdate(
            { clerkId: id },
            { email, clerkId: id },
            { upsert: true, new: true }
        );
    }
    
    res.status(200).json({ message: 'Webhook processed' });
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true });
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res.status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, null, "Logout successful"));
});

// Change Password
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "The old password is incorrect");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: true });
    return res.status(200).json(new ApiResponse(200, null, "Password was changed"));
});

// Generate Cloudinary direct upload signature
const getCloudinarySignature = asyncHandler(async (req, res) => {
    const sigData = getUploadSignature();
    return res.status(200).json(
        new ApiResponse(200, sigData, "Upload signature generated successfully")
    );
});

// Register Issue (Report)

import { issueValidationQueue } from "../queues/issuesValidation.queue.js";
import { getNextComplaintId } from "../utils/counterUtil.js";

const registerIssues = asyncHandler(async (req, res) => {
    const { description, location, lat, lng, imageUrl: directImageUrl } = req.body;
    if (!description || description.trim() === "") {
        throw new ApiError(400, "Description is required");
    }
    const userId = req.user._id;
    if (!location || !lat || !lng) {
        throw new ApiError(400, "Location and coordinates are required");
    }

    let absoluteFilePath = null;
    let finalImageUrl = directImageUrl || '';

    // If client did not provide direct imageUrl, check for local multipart file upload
    if (!finalImageUrl) {
        const civicIssueLocalPath = req.files?.civicIssue?.[0]?.path;
        if (!civicIssueLocalPath) {
            throw new ApiError(400, "Civic issue image or imageUrl is required");
        }
        absoluteFilePath = path.resolve(civicIssueLocalPath);
        if (!fs.existsSync(absoluteFilePath)) {
            throw new ApiError(500, "Uploaded file not found");
        }
        console.log('File uploaded to:', absoluteFilePath);
    } else {
        console.log('Received pre-uploaded direct imageUrl:', finalImageUrl);
    }

    // Insert a placeholder record immediately so the citizen sees it in their table right away
    const complaintId = await getNextComplaintId();
    const placeholderReport = await Report.create({
        complaintId,
        userId,
        description,
        location,
        imageUrl: finalImageUrl,       // if direct upload, client already provided it!
        category: 'analysing',
        department: 'Pending',
        mlStatus: 'analysing',
        severity: 'low',
        coordinates: {
            lat: Number(lat),
            lng: Number(lng),
        },
    });
    console.log(`Placeholder report created: ${placeholderReport._id} (complaintId: ${complaintId})`);

    const reportData = {
        userId,
        description,
        location,
        lat,
        lng,
        imageUrl: finalImageUrl,
        localFilePath: absoluteFilePath,
        reportId: placeholderReport._id.toString(), // pass ID so worker can update instead of create
    };

    const job = await issueValidationQueue.add('validate-and-process-report', { reportData });
    console.log(`Job with ID ${job.id} added to the queue.`);
    return res.status(202).json(
        new ApiResponse(202, { jobId: job.id, reportId: placeholderReport._id }, 'Your report has been submitted for processing.')
    );
});

// In user.controllers.js getAllReports function
const getAllReports = asyncHandler(async (req, res) => {
    // Query database, sort newest reports first
    const allReports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    return res.status(200).json(new ApiResponse(200, allReports, "Reports fetched successfully"));
});

// In user.controllers.js getLeaderboard function
const getLeaderboard = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;
    const cacheKey = `leaderboard:top${limit}`;
    
    // Try cache first
    try {
        const cachedLeaderboard = await appRedis.get(cacheKey);
        if (cachedLeaderboard) {
            const parsed = JSON.parse(cachedLeaderboard);
            // Still need to calculate user rank dynamically
            const currentUser = await User.findById(req.user._id);
            const higherUsersCount = await User.countDocuments({ 
                civicSenseScore: { $gt: currentUser.civicSenseScore } 
            });
            const userRank = higherUsersCount + 1;
            
            return res.status(200).json(
                new ApiResponse(200, {
                    ...parsed,
                    userRank,
                    userScore: currentUser.civicSenseScore
                }, "Leaderboard fetched from cache")
            );
        }
    } catch (cacheError) {
        console.log('Leaderboard cache miss');
    }
    
    // Original logic...
    const topUsers = await User.find()
        .select("-password")
        .sort({ civicSenseScore: -1 })
        .limit(Number(limit));
    
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
        throw new ApiError(404, "User not found");
    }
    
    const higherUsersCount = await User.countDocuments({ 
        civicSenseScore: { $gt: currentUser.civicSenseScore } 
    });
    const userRank = higherUsersCount + 1;
    
    const userInTop10 = topUsers.some(user => user._id.toString() === req.user._id.toString());
    
    const result = {
        topUsers,
        userRank,
        userInTop10,
        userScore: currentUser.civicSenseScore
    };
    
    // Cache for 15 minutes (leaderboards don't change often)
    try {
        await appRedis.setex(cacheKey, 900, JSON.stringify({
            topUsers,
            userInTop10
        }));
    } catch (cacheError) {
        console.log('Leaderboard cache set error:', cacheError.message);
    }
    
    return res.status(200).json(
        new ApiResponse(200, result, "Leaderboard fetched successfully")
    );
});

const getReportStatus = asyncHandler(async (req,res)=>{
    const jobId = req.params.jobId || req.query.jobId;
    if(!jobId ){
        throw new ApiError(400,"Job ID is required");
    }
    const job = await issueValidationQueue.getJob(jobId);
    if (!job) {
        throw new ApiError(404, "Job not found. It may have expired or been removed.");
    }
    const jobState = await job.getState();
    let message;
    let data = null;

    switch (jobState) {
        case 'completed':
            message = 'Processing complete. Your report is ready.';
            data = { state: 'completed', ...(job.returnvalue || {}) };
            break;
        case 'failed':
            message = 'Processing failed. Please try again.';
            data = { state: 'failed', failedReason: job.failedReason };
            break;
        default:
            message = 'Your report is being processed.';
            data = { state: jobState };
            break;
    }

    return res.status(200).json(new ApiResponse(200, data, message));
});



const getUserNotifications = asyncHandler(async (req, res) => {
    // req.user._id comes from your verifyJWT middleware
    const notifications = await Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 }) // Newest first
        .limit(20); // Don't overload the frontend

    return res.status(200).json(
        new ApiResponse(200, notifications, "Notifications fetched successfully")
    );
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: req.user._id },
        { $set: { status: 'READ' } },
        { new: true }
    );

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    return res.status(200).json(
        new ApiResponse(200, notification, "Notification marked as read")
    );
});



import { sseManager } from "../utils/sse.js";

const streamReportUpdates = asyncHandler(async (req, res) => {
    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable Nginx reverse-proxy buffering
    if (res.flushHeaders) {
        res.flushHeaders();
    }

    const userId = req.user._id;
    sseManager.addClient(userId, res);

    // Initial connected event
    res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', timestamp: Date.now() })}\n\n`);

    // Keep-alive heartbeat ping every 25 seconds
    const heartbeat = setInterval(() => {
        try {
            res.write(`event: ping\ndata: ${Date.now()}\n\n`);
        } catch (_) {
            clearInterval(heartbeat);
        }
    }, 25000);

    req.on('close', () => {
        clearInterval(heartbeat);
    });
});

export { handleClerkWebhook, logoutUser, changeCurrentPassword, registerIssues, getAllReports, getLeaderboard, getReportStatus, getUserNotifications, markNotificationAsRead, getCloudinarySignature, streamReportUpdates };