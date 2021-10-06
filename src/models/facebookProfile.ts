import { Schema, Document, model } from "mongoose";

export interface IFacebookProfile extends Document {
    profileId: string
    name: string
    followerValue: number
    likeValue: number
    backgroundImgUrl: string
    profileImgUrl: string
}

export const facebookProfileSchema = new Schema({
    profileId:{
      type: String, require: true
    },
    name: {
        type: String, require: true
    },
    followerValue: {
        type: Number, require: false, default: null
    },
    likeValue: {
        type: Number, require: false, default: null
    },
    backgroundImgUrl: {
        type: String, require: false, default: null
    },
    profileImgUrl: {
        type: String, require: false, default: null
    },
},{ timestamps: true, collection: 'facebookProfile'})

export const FacebookProfile = model<IFacebookProfile>('FacebookProfile', facebookProfileSchema)