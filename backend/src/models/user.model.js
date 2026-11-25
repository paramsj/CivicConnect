

import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const userSchema = new Schema({
    userId : {
        type : Number,
        unique : true,
    },  
    clerkId: {
        type: String,
        unique: true,
        sparse: true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    password : {
        type : String,
        required : false,  // Optional for Clerk users
    },
    civicSenseScore : {
        type : Number,
        default : 0,
    },
    refreshToken : {
        type : String,
    }
},{timestamps : true});

userSchema.plugin(AutoIncrement, { inc_field: 'userId' });

userSchema.pre("save", async function(next) {
    // Only hash password if it's provided and modified
    if(!this.isModified("password") || !this.password) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = async function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.generateRefreshToken = async function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,    
        }
    );
};

export const User  = mongoose.model("User",userSchema);


