import express from 'express'
import YoutubeService from '../services/youtubeService'
import FacebookService from '../services/facebookService'
import InstagramService from '../services/instagramService'
import UserController from '../controllers/userController'
import { authenticateJwtToken } from '../middlewares/auth'
const youtubeService = new YoutubeService()
const facebookService = new FacebookService()
const instagramService = new InstagramService()
const userController = new UserController()
const router = express.Router()

router.get('/login', (req, res) =>{
    res.render('login')
})

router.post('/login', userController.logIn)

router.post('/signup', userController.signUp)

router.get('/', authenticateJwtToken, (req, res) =>{
    res.render('index')
})

router.post('/youtube', authenticateJwtToken, async (req, res) =>{
    let [data, err] = await youtubeService.createChannelId(req.body.channelId)
    if(err) {
        console.error({statusCode: 500, status: 'can not get database data!!'})
        res.send({statusCode: 500, status: 'can not get database data!!'})
    }else{
        res.send('ok')
    }
})

router.post('/facebook', authenticateJwtToken, async (req, res) =>{
    let [data, err] = await facebookService.createFacebookId(req.body.facebookId)
    if(err) {
        console.error({statusCode: 500, status: 'can not get database data!!'})
        res.send({statusCode: 500, status: 'can not get database data!!'})
    }else{
        res.send('ok')
    }
})

router.post('/instagram', authenticateJwtToken, async (req, res) =>{
    let [data, err] = await instagramService.createInstagramUserName(req.body.instagramUserName)
    if(err) {
        console.error({statusCode: 500, status: 'can not get database data!!'})
        res.send({statusCode: 500, status: 'can not get database data!!'})
    }else{
        res.send('ok')
    }
})
export default router 