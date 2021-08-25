import cron from 'node-cron'
import FbToWordpress from '../controllers/fbToWordpress'

export default class FbToWordpressSchedule extends FbToWordpress {
    constructor(){
        super()
    }
    async runFbToWordpressSchedules(){
        cron.schedule('0 12 * * *', async () =>{
            await super.allFBToWordpressDb()
        })
    }
}