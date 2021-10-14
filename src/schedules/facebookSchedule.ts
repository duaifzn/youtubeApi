import cron from 'node-cron'
import FacebookApi from '../controllers/facebookApi'
import FacebookPostAnalysis from '../controllers/facebookPostAnalysis'
const facebookPostAnalysis = new FacebookPostAnalysis()
export default class FacebookSchedule extends FacebookApi{
    async runGetPostIdsSchedule(){
        cron.schedule('0 9 * * *', async () =>{
            await super.login()
            await super.getPostIds()
            await super.browserClose()
        })
    }
    async runGetPostCommentSchedule(){
        cron.schedule('10 9 * * *', async () =>{
            await super.login()
            await super.getPostComment()
            await super.browserClose()
        })
    }
    async runGetPostDetailSchedule(){
        cron.schedule('20 9 * * *', async () =>{
            await super.login()
            await super.getPostDetail()
            await super.browserClose()
        })
    }
    async runGetProfileDetailSchedule(){
        cron.schedule('25 9 * * *', async () =>{
            await super.login()
            await super.getProfileDetail()
            await super.browserClose()
        })
    }
    async runFacebookPostAnalysis(){
        cron.schedule('30 9 * * *', async () =>{
            await facebookPostAnalysis.analysis()
        })
    }
    async runFacebookSchedule(){
        await this.runGetPostIdsSchedule()
        await this.runGetPostCommentSchedule()
        await this.runGetPostDetailSchedule()
        await this.runGetProfileDetailSchedule()
        await this.runFacebookPostAnalysis()
    }
}