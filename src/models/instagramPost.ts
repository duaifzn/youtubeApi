import { Schema, Document, model } from "mongoose";

export interface IInstagramPost extends Document{
    postId: string
    ownerId: string
    shortCode: string
    like?: number
    comment?: number
    content?: string
    pictureUrl?: string
}

export const instagramPostSchema = new Schema({
    postId:{
        type: String, require: true
    },
    ownerId:{
        type: String, require: true
    },
    shortCode:{
        type: String, require: true
    },
    like:{
        type: Number, require: false, default:0
    },
    comment:{
        type: Number, require: false, default:0
    },
    content:{
        type: String, require: false, default: null
    },
    pictureUrl:{
        type: String, require: false, default: null
    }
},{ timestamps: true, collection: 'instagramPost'})

export const InstagramPost = model<IInstagramPost>('InstagramPost', instagramPostSchema)