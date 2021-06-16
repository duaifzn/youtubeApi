import {Schema, Document} from 'mongoose';

export interface IYoutubeComment extends Document{
    videoId: string,
    commentId: string,
    parentId: string,
    authorName: string,
    text: string,
    likeCount: number,
    publishedAt: Date,
}

export const youtubeCommentSchema = new Schema({
    videoId:{
        type: String, require: true
    },
    commentId:{
        type: String, require: true
    },
    parentId: {
        type: String
    },
    authorName: {
        type: String, require: true
    },
    text: {
        type: String, require: true
    },
    likeCount: {
        type: Number, require: true
    },
    publishedAt: {
        type: Date, require: true
    }
},{ timestamps: true, collection: 'youtubeComment' })
