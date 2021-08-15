import cron from 'node-cron'
import InstagramApi from '../controllers/instagramApi'

export default class InstagramSchedule extends InstagramApi{
    async runInstagramSchedule(){
        cron.schedule('20 * * * *', async () =>{
            await super.getProfileDetail()
            await super.getPostDetail()
            await super.getPostComment()
        })
    }
}
