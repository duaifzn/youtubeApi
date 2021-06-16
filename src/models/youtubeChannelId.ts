import {Schema, Document} from 'mongoose';

export interface IYoutubeChannelId extends Document{
    channelId: string,
}

export const youtubeChannelIdSchema = new Schema({
    channelId:{
        type: String, require: true
    },
},{ timestamps: true, collection: 'youtubeChannelId' })
