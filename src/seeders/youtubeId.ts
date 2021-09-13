import { YoutubeChannelId } from "../models/youtubeChannelId";

const channelIds = [
    'UCqkpNlntVaoxKpaoi8VoE6w',
    'UCeU05pwtEAreeF81saVb9XQ'
];

export default async function youtubeIdSeed(){
    for(let channelId of channelIds){
        const youtubeChannelId = await YoutubeChannelId.findOne({channelId: channelId})
        if(!youtubeChannelId){
            await YoutubeChannelId.create({channelId: channelId})
        }
    }
    console.log('insert youtube channel ids done!')
}
    

