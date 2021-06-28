import YoutubeService from "../services/youtubeService";
const youtubeService = new YoutubeService();

const channelIds = [
    'UCqkpNlntVaoxKpaoi8VoE6w',
    'UCeU05pwtEAreeF81saVb9XQ'
];
async function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () =>{
    await timeout(5000);
    for(let channelId of channelIds){
        await youtubeService.createChannelId(channelId)
    }
    console.log('insert youtube channel ids done!')
    process.exit(0)
})()

