import {Schema, Document} from 'mongoose';

export interface IFacebookPost extends Document{
    postId: string,
    ownerId: string,
    title: string,
    img: string,
    like: number,
    share: number,
    comment: number,
    wpPostId: number, 
}

export const facebookPostSchema = new Schema({
    postId:{
        type: String, require: true
    },
    ownerId:{
        type: String, require: true
    },
    title:{
        type: String, require: false, default: null
    },
    img:{
        type: String, require: false, default: null
    },
    like:{
        type: Number, require: true, default: 0
    },
    share:{
        type: Number, require: true, default: 0
    },
    comment:{
        type: Number, require: true, default: 0
    },
    wpPostId:{
        type: Number, require: false, default: null
    }
},{ timestamps: true, collection: 'facebookPost' })
