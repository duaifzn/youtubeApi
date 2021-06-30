import { Schema, Document } from "mongoose";

export interface IInstagramComment extends Document{
    commentId: string
    postId: string
    ownerId: string
    shortCode: string
    commenterId: string
    commenterName: string
    commenterPicture?: string
    content: string
}

export const instagramCommentSchema = new Schema({
    commentId:{
        type: String, require: true
    },
    postId:{
        type: String, require: true
    },
    ownerId:{
        type: String, require: true
    },
    shortCode:{
        type: String, require: true
    },
    commenterId:{
        type: String, require: true
    },
    commenterName:{
        type: String, require: true
    },
    commenterPicture:{
        type: String, require: false, default: null
    },
    content:{
        type: String, require: true
    },
},{ timestamps: true, collection: 'instagramComment'})