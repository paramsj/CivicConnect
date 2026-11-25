import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongooseSequence from 'mongoose-sequence';
import { User } from "./user.model.js";
import { Report } from "./report.model.js";

const NotificationSchema =  new Schema({
    recipient : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    message : {
        type : String,
    },
    reportId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Report",
    },
    status : {
        type : String,
        enum : ['UNREAD','READ'],
        default : 'UNREAD'
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    type: {
        type: String,
        enum: ['STATUS_CHANGE', 'COMMENT_ADDED', 'SYSTEM_ALERT'],
        default: 'STATUS_CHANGE'
    }
},{timestamps : true});

export const updateReportStatus = async (req, res) => {
    const { reportId, newStatus } = req.body;

    const report = await Report.findByIdAndUpdate(reportId, { status: newStatus }, { new: true });

    // CREATE THE NOTIFICATION
    await Notification.create({
        recipient: report.owner, // The user who filed the complaint
        reportId: report._id,
        message: `Your report status has been updated to ${newStatus}.`,
        type: 'STATUS_CHANGE'
    });

    // NEXT STEP: Emit via Socket.io if the user is online
    // io.to(report.owner.toString()).emit("notification", notification);

    res.status(200).json({ message: "Status updated and user notified" });
};

export const Notification = mongoose.model("Notification",NotificationSchema);