import cron from 'node-cron'
import { youtubeChannelData } from '../controllers/youtubeApi'
import YoutubeService from '../services/youtubeService'

export default class YoutubeSchedule extends YoutubeService{
    async runSchedule(){
        cron.schedule('2 * * * *', async () =>{
            console.log('run schedule')
            const channelIds = await super.getChannelIds();
            for await(const channelId of channelIds){
                await youtubeChannelData(channelId)
            }
        })
    }
}