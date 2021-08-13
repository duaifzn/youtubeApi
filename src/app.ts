import express from 'express'
import cors from 'cors'
import { Config } from './config/config'
import router from './routes/route'
import YoutubeSchedule from './schedules/youtubeSchedule'
import FacebookSchedule from './schedules/facebookSchedule'
import InstagramSchedule from './schedules/instagramSchedule'
import { sequelize } from './models/wordpress/_index'
import WordpressService from './services/wordpressService'
const wordpressService = new WordpressService()
const youtubeSchedule = new YoutubeSchedule()
const facebookPostIdsSchedule = new FacebookSchedule()
const facebookPostCommentSchedule = new FacebookSchedule()
const facebookPostDetailSchedule = new FacebookSchedule()
const facebookProfileSchedule = new FacebookSchedule()
const instagramSchedule = new InstagramSchedule()

const allowedOrigins = Config[process.env.NODE_ENV].allowOrigins
const options: cors.CorsOptions = {
    origin: allowedOrigins
  };

sequelize.authenticate()
.then(async () => {
  console.log("connected to wordpress db.")
  // await wordpressService.createPostToWordpress({
  //   postId: '123',
  //   ownerId: '456',
  //   title: 'test123',
  //   img: null,
  //   like: 2323,
  //   share: 45454,
  //   comment: 5555,
  //   wpPostId: null, 
  // },)
}).catch((err) => {
  console.log("connect wordpress db fail!!")
  console.error(err)
});

const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs'); 
app.use(express.static('views'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors(options))
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


