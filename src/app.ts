import express from 'express'
import cors from 'cors'
import { Config } from './config/config'
import router from './routes/route'
import YoutubeSchedule from './schedules/youtubeSchedule'
import FacebookSchedule from './schedules/facebookSchedule'
import InstagramSchedule from './schedules/instagramSchedule'
import FbToWordpressSchedule from './schedules/fbToWordpressSchedule'
import { sequelize } from './models/wordpress/_index'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
let youtubeSchedule = new YoutubeSchedule()
let instagramSchedule = new InstagramSchedule()
let facebookSchedule = new FacebookSchedule()
let fbToWordpressSchedule = new FbToWordpressSchedule()
const config = Config[process.env.NODE_ENV]
const mongoDb = config.mongoDb
const allowedOrigins = config.allowOrigins
export default class App {
  app: express.Application
  port: number
  constructor(){
    this.app = express()
    this.port = Number(process.env.PORT) || 3000;
    this.config()
    this.listen()
    this.connectMongo()
    this.connectWordpressDb()
  }

  config(){
    const options: cors.CorsOptions = {
        origin: allowedOrigins
      };
    this.app.set('view engine', 'ejs'); 
    this.app.use(express.static('views'))
    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: false}))
    this.app.use(cors(options))
    this.app.use(cookieParser())
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
      console.log("wordpressDB connected!!")
    }).catch((err) => {
      console.log("Failed to connect to wordpressDb")
      console.error(err)
    });
  }

  async connectMongo(){
    try{
        await mongoose.connect(mongoDb.mongoUri, {
            authSource: mongoDb.authSource,
            user: mongoDb.user,
            pass: mongoDb.pass,
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true, 
        })
        console.log('MongoDB connected!!');
    }catch(err){
        console.log('Failed to connect to MongoDB:\n', err);
    } 
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