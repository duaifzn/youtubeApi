import { Schema, Document } from "mongoose";

export interface IInstagramProfile extends Document{
    userId: string
    userName: string
    fullName: string
    followerValue: number
    followingValue: number
    pictureUrl?: string
}

export const instagramProfileSchema = new Schema({
    userId:{
        type: String, require: true
    },
    userName:{
        type: String, require: true
    },
    fullName:{
        type: String, require: true
    },
    followerValue:{
        type: Number, require: true
    },
    followingValue:{
        type: Number, require: true
    },
    pictureUrl:{
        type: String, default: null
    }
},{ timestamps: true, collection: 'instagramProfile'})