import express from 'express'
import YoutubeService from '../services/youtubeService'
const youtubeService = new YoutubeService()
const router = express.Router()

router.get('/', (req, res) =>{
    res.render('index')
})
router.post('/youtube',async (req, res) =>{
    let [data, err] = await youtubeService.createChannelId(req.body.channelId)
    if(err) console.error(err)
    res.send(data)
})

export default router 