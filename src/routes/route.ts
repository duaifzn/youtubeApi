import express from 'express'
import YoutubeService from '../services/youtubeService'
import FacebookService from '../services/facebookService'
import InstagramService from '../services/instagramService'
const youtubeService = new YoutubeService()
const facebookService = new FacebookService()
const instagramService = new InstagramService()
const router = express.Router()

router.get('/', (req, res) =>{
    res.render('index')
})
router.post('/youtube',async (req, res) =>{
    let [data, err] = await youtubeService.createChannelId(req.body.channelId)
    if(err) {
        console.error(err)
        res.send(err)
    }else{
        res.send('ok')
    }
})
router.post('/facebook',async (req, res) =>{
    let [data, err] = await facebookService.createFacebookId(req.body.facebookId)
    if(err) {
        console.error(err)
        res.send(err)
    }else{
        res.send('ok')
    }
})
router.post('/instagram',async (req, res) =>{
    let [data, err] = await instagramService.createInstagramUserName(req.body.instagramUserName)
    if(err) {
        console.error(err)
        res.send(err)
    }else{
        res.send('ok')
    }
})
export default router 