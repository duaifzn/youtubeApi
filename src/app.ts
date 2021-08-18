import express from 'express'
import cors from 'cors'
import { Config } from './config/config'
import router from './routes/route'
import YoutubeSchedule from './schedules/youtubeSchedule'
import FacebookSchedule from './schedules/facebookSchedule'
import InstagramSchedule from './schedules/instagramSchedule'
import FbToWordpressSchedule from './schedules/fbToWordpressSchedule'
import { sequelize } from './models/wordpress/_index'
let youtubeSchedule = new YoutubeSchedule()
let instagramSchedule = new InstagramSchedule()
let facebookSchedule = new FacebookSchedule()
let fbToWordpressSchedule = new FbToWordpressSchedule()
export default class App {
  app: express.Application
  port: number
  constructor(){
    this.app = express()
    this.port = Number(process.env.PORT) || 3000;
    this.config()
    this.listen()
    this.connectWordpressDb()
  }

  config(){
    const allowedOrigins = Config[process.env.NODE_ENV].allowOrigins
    const options: cors.CorsOptions = {
        origin: allowedOrigins
      };
    this.app.set('view engine', 'ejs'); 
    this.app.use(express.static('views'))
    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: false}))
    this.app.use(cors(options))
    this.app.use('/', router)
  }

  listen(){
    this.app.listen(this.port, () =>{
      console.log(`server running on port ${this.port}`)
    })
  }

  connectWordpressDb(){
    sequelize.authenticate()
    .then(async () => {
      console.log("connected to wordpress db.")
    }).catch((err) => {
      console.log("connect wordpress db fail!!")
      console.error(err)
    });
  }

  async runFbCronjob(){
    await facebookSchedule.runFacebookSchedule()
    await fbToWordpressSchedule.runFbToWordpressSchedules()
  }

  async runIgCronjob(){
    await instagramSchedule.runInstagramSchedule()
  }

  async runYtCronjob(){
    await youtubeSchedule.runYoutubeSchedule()
  }
}