import express from 'express'
import router from './routes/route'
import YoutubeSchedule from './schedules/youtubeSchedule'
import FacebookSchedule from './schedules/facebookSchedule'
import InstagramSchedule from './schedules/instagramSchedule'
const youtubeSchedule = new YoutubeSchedule()
const facebookPostIdsSchedule = new FacebookSchedule()
const facebookPostCommentSchedule = new FacebookSchedule()
const facebookPostDetailSchedule = new FacebookSchedule()
const facebookProfileSchedule = new FacebookSchedule()
const instagramSchedule = new InstagramSchedule()

const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs'); 
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/', router)


app.listen(port, () =>{
    console.log(`server running on port ${port}`)
    youtubeSchedule.runSchedule()
    facebookPostIdsSchedule.runGetPostIdsSchedule()
    facebookPostCommentSchedule.runGetPostCommentSchedule()
    facebookPostDetailSchedule.runGetPostDetailSchedule()
    facebookProfileSchedule.runGetProfileDetailSchedule()
    instagramSchedule.runSchedule()
})


