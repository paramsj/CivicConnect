import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const reportSchema = new Schema({
    complaintId: {
        type: Number,
        //unique: true,
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    imageUrl : {
        type : String,
        default: '',
    },
    description : {
        type : String,
        required : true,
    },
    location : {
        type : String,
        required : true,
    },
    category: {
        type: String,
        required: true,
        default: 'others'
    },
    department: {
        type: String,
        required: true,
        default: 'General Services'
    },
    mlStatus: {
        type: String,
        enum: ['analysing', 'done', 'failed'],
        default: 'done'
    },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'low'
    },
    progress: {
        type: String,
        enum: ['submitted', 'pending', 'accepted', 'assigned', 'in_progress', 'in-progress', 'completed', 'resolved'],
        default: 'submitted'
    },
    adminNotes: {
        type: String,
        default: ''
    },
    reportStartDate : {
        type : Date,
        default : Date.now
    },
    reportEndDate : {
        type : Date,
    }
},{timestamps : true});

// reportSchema.plugin(AutoIncrement, { inc_field: 'complaintId' });

export const Report = mongoose.model("Report", reportSchema);