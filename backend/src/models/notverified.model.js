import mongoose, { Schema } from "mongoose";
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);
const pendingReportSchema = new Schema({
    pendingId : {
        type : Number,
        unique : true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    localImagePath: { // Store the temporary file path here
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    status: {
        type: String,
        enum: ['submitted', 'processing', 'failed', 'completed'],
        default: 'submitted'
    }
}, { timestamps: true });

export const PendingReport = mongoose.model("PendingReport", pendingReportSchema);

userSchema.plugin(AutoIncrement, { inc_field: 'pendingId' });