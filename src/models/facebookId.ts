import {Schema, Document, model} from 'mongoose';

export interface IFacebookId extends Document{
    id: string,
}

export const facebookIdSchema = new Schema({
    id:{
        type: String, require: true
    },
},{ timestamps: true, collection: 'facebookId' })

export const FacebookId = model<IFacebookId>('FacebookId', facebookIdSchema)