import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiReponse.js";
import { Admin } from "../models/admin.model.js";
import { Report } from "../models/report.model.js";
import { User} from "../models/user.model.js";
import { sseManager } from "../utils/sse.js";
// Register Admin
const registerAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if ([email, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        throw new ApiError(400, "Admin already exists");
    }
    const admin = await Admin.create({ email, password });
    const createdAdmin = await Admin.findById(admin._id).select("-password");
    if (!createdAdmin) {
        throw new ApiError(500, "Failed to create admin");
    }
    return res.status(201).json(
        new ApiResponse(201, createdAdmin, "Admin created successfully")
    );
});

// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }
    const isPasswordCorrect = await admin.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "The password is incorrect");
    }
    const accessToken = await admin.generateAccessToken();
    const refreshToken = await admin.generateRefreshToken();
    admin.refreshToken = refreshToken;
    await admin.save();
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res.status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(200, {
                admin: { ...admin.toObject(), password: undefined },
                accessToken,
                refreshToken,
            }, "Login successful")
        );
});

// Logout Admin
const logoutAdmin = asyncHandler(async (req, res) => {
    await Admin.findByIdAndUpdate(req.admin._id, { $set: { refreshToken: undefined } }, { new: true });
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
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }
    const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "The old password is incorrect");
    }
    admin.password = newPassword;
    await admin.save({ validateBeforeSave: true });
    return res.status(200).json(new ApiResponse(200, null, "Password was changed"));
});

import {appRedis} from "../utils/redis.js";

const getAllReports = asyncHandler(async (req, res) => {
    const { 
        location, 
        searchTerm, 
        status, 
        category, 
        severity, 
        department,
        sortBy = 'createdAt_desc',
        limit = 50,
        page = 1,
        noCache = false
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (location) {
        filter.location = { $regex: location, $options: 'i' };
    }
    
    if (status && status !== 'all') {
        filter.progress = status;
    }
    
    if (category && category !== 'all') {
        filter.category = { $regex: category, $options: 'i' };
    }
    
    if (severity && severity !== 'all') {
        filter.severity = severity;
    }
    
    if (department && department !== 'all') {
        filter.department = { $regex: department, $options: 'i' };
    }
    
    // Search across multiple fields
    if (searchTerm && searchTerm.trim()) {
        const searchRegex = { $regex: searchTerm.trim(), $options: 'i' };
        filter.$or = [
            { description: searchRegex },
            { location: searchRegex },
            { category: searchRegex },
            { department: searchRegex }
        ];
    }
    
    // Build sort object
    let sort = {};
    switch (sortBy) {
        case 'date_newest':
            sort = { createdAt: -1 };
            break;
        case 'date_oldest':
            sort = { createdAt: 1 };
            break;
        case 'severity_high':
            sort = { severity: -1 };
            break;
        case 'severity_low':
            sort = { severity: 1 };
            break;
        default:
            sort = { createdAt: -1 };
    }
    
    const parsedLimit = Math.max(1, parseInt(limit) || 50);
    const parsedPage = Math.max(1, parseInt(page) || 1);
    const skip = (parsedPage - 1) * parsedLimit;
    
    // Phase 1: Fast ID-only index query from MongoDB
    const idDocs = await Report.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parsedLimit)
        .select('_id')
        .lean();
    
    const total = await Report.countDocuments(filter);
    const ids = idDocs.map(doc => doc._id.toString());
    
    if (ids.length === 0) {
        return res.status(200).json(new ApiResponse(200, {
            reports: [],
            total: 0,
            page: parsedPage,
            totalPages: 0,
            hasMore: false
        }, "No reports found"));
    }
    
    let reports = [];
    
    if (noCache === 'true') {
        // Direct DB fetch if cache bypass is explicitly requested
        reports = await Report.find({ _id: { $in: ids } })
            .sort(sort)
            .populate('userId', 'email')
            .lean();
    } else {
        // Phase 2: Multi-get (MGET) object payloads from Redis
        const redisKeys = ids.map(id => `report:${id}`);
        let cachedValues = [];
        try {
            cachedValues = await appRedis.mget(...redisKeys);
        } catch (mgetErr) {
            console.warn('[Cache MGET Warning]:', mgetErr.message);
            cachedValues = new Array(ids.length).fill(null);
        }
        
        const reportMap = new Map();
        const missingIds = [];
        
        ids.forEach((id, index) => {
            const raw = cachedValues[index];
            if (raw) {
                try {
                    reportMap.set(id, JSON.parse(raw));
                } catch (parseErr) {
                    missingIds.push(id);
                }
            } else {
                missingIds.push(id);
            }
        });
        
        // Fetch only cache misses from MongoDB
        if (missingIds.length > 0) {
            const fetchedDocs = await Report.find({ _id: { $in: missingIds } })
                .populate('userId', 'email')
                .lean();
            
            // Populate Redis cache for missed objects (TTL: 1 hour)
            const pipeline = appRedis.pipeline();
            fetchedDocs.forEach(doc => {
                const docId = doc._id.toString();
                reportMap.set(docId, doc);
                pipeline.setex(`report:${docId}`, 3600, JSON.stringify(doc));
            });
            
            try {
                await pipeline.exec();
            } catch (pipeErr) {
                console.warn('[Cache Pipeline Warning]:', pipeErr.message);
            }
        }
        
        // Preserve exact sort order from Phase 1
        reports = ids.map(id => reportMap.get(id)).filter(Boolean);
    }
    
    const result = {
        reports,
        total,
        page: parsedPage,
        totalPages: Math.ceil(total / parsedLimit),
        hasMore: skip + reports.length < total
    };
    
    return res.status(200).json(new ApiResponse(200, result, "Reports fetched successfully"));
});

import { Notification } from "../models/notification.model.js";

const changeStatus = asyncHandler(async (req, res) => {
    const { reportId, status, notes } = req.body;

    const report = await Report.findOne({ complaintId: reportId });
    if (!report) {
        throw new ApiError(404, "Report not found");
    }
    
    report.progress = status;
    if (notes !== undefined && notes !== null) {
        report.adminNotes = notes;
    }
    await report.save();

    // 1. CREATE PERSISTENT NOTIFICATION (Safely handled so notification failure never blocks status update)
    const recipient = report.userId || report.owner;
    if (recipient) {
        try {
            const notifMessage = notes
                ? `Admin has updated your report #${report.complaintId} to ${status}: "${notes}"`
                : `Admin has updated your report #${report.complaintId} to: ${status}`;

            const notification = await Notification.create({
                recipient,
                reportId: report._id,
                message: notifMessage,
                status: 'UNREAD'
            });

            // 2. REAL-TIME EMISSION (Socket.io)
            const io = req.app.get("io");
            if (io) {
                io.to(recipient.toString()).emit("new_notification", {
                    message: notification.message,
                    reportId: report._id,
                    createdAt: notification.createdAt
                });
            }

            // Real-time Server-Sent Events (SSE) push directly to citizen dashboard
            try {
                sseManager.sendToUser(recipient, 'report_status_updated', {
                    reportId: report._id,
                    complaintId: report.complaintId,
                    progress: report.progress,
                    status: report.progress,
                    adminNotes: report.adminNotes || '',
                    category: report.category,
                    department: report.department
                });
            } catch (sseErr) {
                console.warn('[Admin Controller] SSE dispatch warning:', sseErr.message);
            }
        } catch (notifError) {
            console.warn("Notification creation failed (status was still updated):", notifError.message);
        }
    }

    // 3. OBJECT CACHE INVALIDATION
    // With ID-first caching, we only delete this single report's object cache!
    try {
        await appRedis.del(`report:${report._id.toString()}`);
        console.log(`[Cache Invalidation] Purged single object cache for report:${report._id}`);
    } catch (cacheError) {
        console.error('Cache invalidation error:', cacheError.message);
    }

    return res.status(200).json(new ApiResponse(200, report, "Status updated successfully"));
});

export { registerAdmin, loginAdmin, logoutAdmin, changeCurrentPassword, getAllReports , changeStatus};