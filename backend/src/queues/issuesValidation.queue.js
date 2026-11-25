import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';
import mongoose from 'mongoose';
import { Report } from '../models/report.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js'; 
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import appRedis, { queueRedis, workerRedis } from '../utils/redis.js';
import path from 'path';
import { getNextComplaintId } from '../utils/counterUtil.js';
import { sseManager } from '../utils/sse.js';

// Add MongoDB connection for the worker
const connectToMongoDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not set in environment variables.");
        }
        if (mongoose.connection.readyState === 0) {
            const MONGODB_URI = process.env.MONGODB_URI;
            await mongoose.connect(MONGODB_URI, {
                dbName: 'SIH'
            });
            console.log('Queue worker connected to MongoDB');
        } else {
            console.log('Queue worker using existing MongoDB connection');
        }
    } catch (error) {
        console.error('MongoDB connection failed in worker:', error.message);
        throw error;
    }
};


async function waitForFile(filePath, maxWaitMs = 5000) {
    // Convert relative path to absolute path safely
    const absolutePath = path.isAbsolute(filePath) 
        ? filePath 
        : path.resolve(process.cwd(), filePath);
    
    console.log(`Waiting for file: ${absolutePath}`);
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitMs) {
        if (fs.existsSync(absolutePath)) {
            // File exists, now check if it's fully written (stable size)
            try {
                const stats = fs.statSync(absolutePath);
                if (stats.size > 0) {
                    // Wait a bit more and check if size is stable
                    await new Promise(resolve => setTimeout(resolve, 100));
                    const newStats = fs.statSync(absolutePath);
                    if (newStats.size === stats.size && stats.size > 0) {
                        console.log(`File ready: ${absolutePath} (${stats.size} bytes)`);
                        return absolutePath; // Return the absolute path
                    }
                }
            } catch (error) {
                // File might be in process of being written
            }
        }
        
        // Wait before checking again
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    throw new Error(`File not ready after ${maxWaitMs}ms: ${absolutePath}`);
}


async function classifyImageWithFlask(imageUrl) {
    try {
        console.log(`Sending Cloudinary URL to ML API: ${imageUrl}`);
        const mlUrl = process.env.ML_API_URL || (process.env.NODE_ENV === 'production' ? 'http://ai-service:7860/predict' : 'http://127.0.0.1:7860/predict');
        const response = await axios.post(
            mlUrl,
            { image_url: imageUrl },  // Send URL as JSON
            { 
                headers: { 'Content-Type': 'application/json' },
                timeout: 60000  // 60 seconds for HF cold start
            }
        );
        if (response.data && response.data.success) {
            console.log('ML API classification successful:', response.data.result.predicted_class);
            return response.data.result;
        } else {
            throw new Error(response.data.error || 'Unknown error from Flask');
        }
    } catch (err) {
        console.error('ML API error:', err.message);
        throw new Error('Flask classification failed: ' + err.message);
    }
}


// Create the queue
export const issueValidationQueue = new Queue('issue-validation', { 
    connection: queueRedis 
});

// Worker to process jobs
export const issueValidationWorker = new Worker(
    'issue-validation',
    async job => {
        const { reportData } = job.data;
        const { userId, description, location, lat, lng, localFilePath, reportId, imageUrl: directImageUrl } = reportData;

        try {
            console.log(`Processing job ${job.id} for user ${userId}`);
            
            // Ensure MongoDB is connected
            await connectToMongoDB();
            
            if (!description || description.includes('banned')) {
                throw new Error('Description contains banned words or is empty.');
            }

            let imageUrl = directImageUrl;

            // If direct image URL was provided, skip local file handling and Cloudinary upload entirely
            if (imageUrl) {
                console.log(`Using pre-uploaded direct image URL: ${imageUrl}`);
            } else {
                if (!localFilePath) {
                    throw new Error('No image URL or local file path provided.');
                }
                // Wait for the local file to be ready
                await waitForFile(localFilePath);
                console.log(`File is ready for processing: ${localFilePath}`);
                
                console.log('Uploading to Cloudinary...');
                const uploadResult = await uploadOnCloudinary(localFilePath);
                imageUrl = uploadResult.secure_url;
                console.log('Cloudinary upload successful:', imageUrl);
            }

            console.log('Calling Flask for classification...');
            let flaskResult = null;
            try {
                flaskResult = await classifyImageWithFlask(imageUrl);
                console.log('Flask classification result:', flaskResult);
            } catch (mlErr) {
                console.warn('ML classification failed or AI service unavailable; falling back to default category:', mlErr.message);
                flaskResult = {
                    predicted_class: 'others',
                    confidence: 0
                };
            }

            // Map the category
            
            const categoryMapping = {
                'POTHOLES': 'potholes',
                'GARBAGE': 'garbage',
                'CONSTRUCTION ROAD': 'construction road',
                'BROKEN SIGNAGE': 'broken signage',
                'BAD STREETLIGHT': 'bad streetlight',
                'BAD BILLBOARD': 'bad billboard',
                'GRAFFITI': 'graffiti',
                'FADED SIGNAGE': 'faded signage',
                'SAND ON ROAD': 'sand on road',
                'CLUTTER SIDEWALK': 'clutter sidewalk',
                'UNKEPT FACADE': 'unkept facade'
            };

            const category = categoryMapping[flaskResult.predicted_class] || 'others';
            const confidence = flaskResult.confidence;
            
            if (!imageUrl) {
                throw new Error('No image URL available for report.');
            }

            let department, severity;
            switch (category) {
                case 'potholes':
                    department = 'Public Works Department';
                    severity = 'high';
                    break;
                case 'garbage':
                    department = 'Sanitation Department';
                    severity = 'high';
                    break;
                case 'construction road':
                    department = 'Public Works Department';
                    severity = 'medium';
                    break;
                case 'broken signage':
                    department = 'Infrastructure Department';
                    severity = 'medium';
                    break;
                case 'bad streetlight':
                    department = 'Infrastructure Department';
                    severity = 'medium';
                    break;
                case 'bad billboard':
                    department = 'Advertising & Infrastructure';
                    severity = 'medium';
                    break;
                case 'graffiti':
                    department = 'Municipal Art & Cleaning';
                    severity = 'low';
                    break;
                case 'faded signage':
                    department = 'Infrastructure Department';
                    severity = 'low';
                    break;
                case 'sand on road':
                    department = 'Public Works Department';
                    severity = 'low';
                    break;
                case 'clutter sidewalk':
                    department = 'Sanitation Department';
                    severity = 'low';
                    break;
                case 'unkept facade':
                    department = 'Urban Planning / General Services';
                    severity = 'low';
                    break;
                default:
                    department = 'General Services';
                    severity = 'low';
            }

            console.log('About to update report in database...');
            
            let updatedReport;
            if (reportId) {
                // Update the placeholder record that was inserted immediately on submission
                updatedReport = await Report.findByIdAndUpdate(
                    reportId,
                    {
                        imageUrl,
                        category,
                        department,
                        severity,
                        mlStatus: 'done',
                    },
                    { new: true }
                );
                console.log(`Updated placeholder report ${reportId} with ML results`);
            } else {
                // Fallback: old-style create (no placeholder was made)
                const complaintId = await getNextComplaintId();
                console.log('Using complaintId:', complaintId);
                updatedReport = await Report.create({
                    complaintId,
                    userId,
                    imageUrl,
                    description,
                    location,
                    category,
                    department,
                    severity,
                    mlStatus: 'done',
                    coordinates: {
                        lat: Number(lat),
                        lng: Number(lng),
                    },
                });
                console.log(`New report created successfully: ${updatedReport._id}`);
            }
            
            console.log(`Report complaintId: ${updatedReport.complaintId}`);
            
            // Clear Redis object cache for this report
            try {
                const idToPurge = updatedReport._id || reportId;
                if (idToPurge) {
                    await appRedis.del(`report:${idToPurge.toString()}`);
                    console.log(`[Queue Worker] Purged object cache for report:${idToPurge}`);
                }
            } catch (cacheErr) {
                console.warn('Queue worker cache clear warning:', cacheErr.message);
            }
            
            // Broadcast live SSE update directly to the citizen's browser
            try {
                sseManager.sendToUser(userId, 'report_classified', {
                    reportId: updatedReport._id,
                    complaintId: updatedReport.complaintId,
                    category: updatedReport.category,
                    department: updatedReport.department,
                    severity: updatedReport.severity,
                    mlStatus: updatedReport.mlStatus,
                    progress: updatedReport.progress,
                    imageUrl: updatedReport.imageUrl,
                    description: updatedReport.description,
                    location: updatedReport.location,
                    coordinates: updatedReport.coordinates,
                    createdAt: updatedReport.createdAt,
                    updatedAt: updatedReport.updatedAt
                });
            } catch (sseErr) {
                console.warn('[Queue Worker] SSE notification warning:', sseErr.message);
            }

            // Clean up file if one was saved locally
            if (localFilePath && fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
                console.log('Cleaned up temporary file');
            }
            
            return { valid: true, report: updatedReport };
            
        } catch (error) {
            console.error('Job processing failed:', error.message);
            console.error('Error details:', error);
            
            // Fail-safe: if placeholder was created, mark it failed so it does not hang forever in 'analysing'
            if (reportId) {
                try {
                    await Report.findByIdAndUpdate(reportId, {
                        category: 'others',
                        department: 'General Services',
                        mlStatus: 'failed',
                    });
                    console.log(`Marked placeholder report ${reportId} as failed so it does not hang`);
                    sseManager.sendToUser(userId, 'report_classified', {
                        reportId,
                        category: 'others',
                        department: 'General Services',
                        severity: 'low',
                        mlStatus: 'failed'
                    });
                } catch (dbErr) {
                    console.error('Failed to update report status on error:', dbErr.message);
                }
            }
            
            // Clean up file on error
            if (localFilePath && fs.existsSync(localFilePath)) {
                try {
                    fs.unlinkSync(localFilePath);
                    console.log('Cleaned up temporary file after error');
                } catch (cleanupError) {
                    console.error('File cleanup error:', cleanupError.message);
                }
            }
            throw error; 
        }
    },
    { 
        connection: workerRedis, // Dedicated worker connection
        concurrency: 1,
        
        // --- PRODUCTION ECO-MODE ---
        // Stops the ~5.4 second batch spam recorded in your logs
        stalledInterval: 300000, 
        lockDuration: 300000,    
        drainDelay: 60,          // The "Spam Killer": Waits 60s when the queue is empty
        // skipStalledCheck removed to ensure job recovery on crash
    }
);

console.log('Queue worker initialized and waiting for jobs...');
