import cron from 'node-cron'
import FbToWordpress from '../controllers/fbToWordpress'

export default class FbToWordpressSchedule extends FbToWordpress {
    constructor(){
        super()
    }
    async runFbToWordpressSchedules(){
        cron.schedule('20 * * * *', async () =>{
            await super.allFBToWordpressDb()
        })
    }
}