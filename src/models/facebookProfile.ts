import { Schema, Document } from "mongoose";

export interface IFacebookProfile extends Document {

}

export const facebookProfileSchema = new Schema({
    profileId:{
      type: String, require: true
    },
    name: {
        type: String, require: true
    },
    followerValue: {
        type: Number
    },
    likeValue: {
        type: Number
    }
})