import {Schema, Document} from 'mongoose';

export interface IYoutube extends Document{
    videoId: string,
    href: string;
    publishedAt: Date;
    desc: string;
    img: string;
    title: string;
    channel: string;
    webSite: string;
}

export const youtubeSchema = new Schema({
    videoId:{
        type: String, require: true
    },
    href:{
        type: String, require: true
    },
    publishedAt: {
        type: Date, require: true
    },
    desc: {
        type: String, require: true
    },
    img: {
        type: String, require: true
    },
    title: {
        type: String, require: true
    },
    channel: {
        type: String, require: true
    },
    webSite: {
        type: String, require: true
    },
},{ timestamps: true, collection: 'youtube' })
