import express from 'express'
import cors from 'cors'
import { Config } from './config/config'
import router from './routes/route'
import YoutubeSchedule from './schedules/youtubeSchedule'
import FacebookSchedule from './schedules/facebookSchedule'
import InstagramSchedule from './schedules/instagramSchedule'
import { sequelize } from './models/wordpress/_index'
import { Mixin } from 'ts-mixer'
export default class App extends Mixin(YoutubeSchedule, FacebookSchedule, InstagramSchedule){
  app: express.Application
  port: number
  constructor(){
    super()
    this.app = express()
    this.port = Number(process.env.PORT) || 3000;
    this.config()
    this.listen()
    this.connectWordpressDb()
    this.runAllSchedule()
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

  runAllSchedule(){
    super.runFacebookSchedule()
    super.runInstagramSchedule()
    super.runYoutubeSchedule()
  }
}

let test = new App()