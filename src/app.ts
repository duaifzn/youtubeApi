import express from 'express'
import router from './routes/route'
import YoutubeSchedule from './schedules/youtubeSchedule'
const youtubeSchedule = new YoutubeSchedule()

const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs'); 
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/', router)


app.listen(port, () =>{
    console.log(`server running on port ${port}`)
    youtubeSchedule.runSchedule()
})


