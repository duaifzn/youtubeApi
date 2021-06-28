import cron from 'node-cron'
import FacebookApi from '../controllers/facebookApi'

export default class FacebookSchedule extends FacebookApi{
    async runGetPostIdsSchedule(){
        cron.schedule('30 * * * *', async () =>{
            await super.loginCookies()
            await super.getPostIds()
            await super.browserClose()
        })
    }
    async runGetPostCommentSchedule(){
        cron.schedule('40 * * * *', async () =>{
            await super.loginCookies()
            await super.getPostComment()
            await super.browserClose()
        })
    }
    async runGetPostDetailSchedule(){
        cron.schedule('50 * * * *', async () =>{
            await super.loginCookies()
            await super.getPostDetail()
            await super.browserClose()
        })
    }
    async runGetProfileDetailSchedule(){
        cron.schedule('55 * * * *', async () =>{
            await super.loginCookies()
            await super.getProfileDetail()
            await super.browserClose()
        })
    }
}
