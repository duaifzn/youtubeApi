import cron from 'node-cron'
import FacebookApi from '../controllers/facebookApi'

export default class FacebookSchedule extends FacebookApi{
    async runGetPostIdsSchedule(){
        cron.schedule('0 10 * * *', async () =>{
            await super.login()
            await super.getPostIds()
            await super.browserClose()
        })
    }
    async runGetPostCommentSchedule(){
        cron.schedule('10 10 * * *', async () =>{
            await super.login()
            await super.getPostComment()
            await super.browserClose()
        })
    }
    async runGetPostDetailSchedule(){
        cron.schedule('20 10 * * *', async () =>{
            await super.login()
            await super.getPostDetail()
            await super.browserClose()
        })
    }
    async runGetProfileDetailSchedule(){
        cron.schedule('30 10 * * *', async () =>{
            await super.login()
            await super.getProfileDetail()
            await super.browserClose()
        })
    }
    async runFacebookSchedule(){
        await this.runGetPostIdsSchedule()
        await this.runGetPostCommentSchedule()
        await this.runGetPostDetailSchedule()
        await this.runGetProfileDetailSchedule()
    }
}