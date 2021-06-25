import {Schema, Document} from 'mongoose';

export interface IFacebookId extends Document{
    id: string,
}

export const facebookIdSchema = new Schema({
    id:{
        type: String, require: true
    },
},{ timestamps: true, collection: 'facebookId' })
