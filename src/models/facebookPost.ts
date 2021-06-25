import {Schema, Document} from 'mongoose';

export interface IFacebookPost extends Document{
    postId: string,
    ownerId: string,
    title: string,
    img: string,
    like: number,
    share: number,
    comment: number
}

export const facebookPostSchema = new Schema({
    postId:{
        type: String, require: true
    },
    ownerId:{
        type: String, require: true
    },
    title:{
        type: String, require: true, default: null
    },
    img:{
        type: String, require: true, default: null
    },
    like:{
        type: Number, require: true, default: 0
    },
    share:{
        type: Number, require: true, default: 0
    },
    comment:{
        type: Number, require: true, default: 0
    }
},{ timestamps: true, collection: 'facebookPost' })
