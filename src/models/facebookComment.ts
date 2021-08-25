import {Schema, Document, model} from 'mongoose';

export interface IFacebookComment extends Document{
    commentId: string
    postId: string,
    ownerId: string,
    commenter: string,
    content: string,
    wpCommentId: number,
}

export const facebookCommentSchema = new Schema({
    commentId:{
        type: String, require: true
    },
    postId:{
        type: String, require: true
    },
    ownerId:{
        type: String, require: true
    },
    commenter:{
        type: String, require: false, default: null
    },
    content:{
        type: String, require: false, default: null
    },
    wpCommentId:{
        type: Number, require: false, default: null
    }
},{ timestamps: true, collection: 'facebookComment' })

export const FacebookComment = model<IFacebookComment>('FacebookComment', facebookCommentSchema)
