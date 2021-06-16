import mongoose, { Model } from 'mongoose';
import { youtubeSchema, IYoutube } from '../models/youtube';
import { youtubeCommentSchema, IYoutubeComment } from '../models/youtubeComment'
import { youtubeChannelIdSchema, IYoutubeChannelId } from '../models/youtubeChannelId'
import { Config } from '../config/config'
const config = Config[process.env.NODE_ENV];
const mongoUri = config.mongoUri;

export default class YoutubeService{
    Youtube: Model<IYoutube>;
    YoutubeComment: Model<IYoutubeComment>;
    YoutubeChannelId: Model<IYoutubeChannelId>;

    constructor(){
        this.Youtube = null
        this.YoutubeComment = null
        this.YoutubeChannelId = null
        this.connectMongo()
    }
    connectMongo(){
        mongoose.connect(mongoUri, {
        authSource: 'admin',
        user: 'eagle',
        pass: 'eagle-eye',
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true, })

        const db = mongoose.connection
        db.once('open', () =>{
            console.log('mongodb connect!')
            this.Youtube = db.model<IYoutube>('Youtube', youtubeSchema)
            this.YoutubeComment = db.model<IYoutubeComment>('YoutubeComment', youtubeCommentSchema)
            this.YoutubeChannelId = db.model<IYoutubeChannelId>('YoutubeChannelId', youtubeChannelIdSchema)
        })
        db.on('error', () =>{
            console.log('mongodb error!!')
        })
    }

    async createVideo(video: {
        videoId: string,
        href: string,
        publishedAt: Date,
        desc: string,
        img: string,
        title: string,
        channel: string,
        webSite: string }){
            try{
                let data = await this.Youtube.findOne({videoId: video.videoId})
                if(data){
                    data.videoId = video.videoId
                    data.href = video.href
                    data.publishedAt = video.publishedAt
                    data.desc = video.desc
                    data.img = video.img
                    data.title = video.title
                    data.channel = video.channel
                    data.webSite = video.webSite
                    await data.save()
                }
                else{
                    await this.Youtube.create({
                        href: video.href,
                        publishedAt: video.publishedAt,
                        desc: video.desc,
                        img: video.img,
                        title: video.title,
                        channel: video.channel,
                        webSite: video.webSite
                    })
                }
                
            }catch(err){
                console.error(err)
            }
    }

    async createComment(comment:{
        videoId: string,
        commentId: string,
        parentId: string,
        authorName: string,
        text: string,
        likeCount: number,
        publishedAt: Date,
    }){
        try{
            let data = await this.YoutubeComment.findOne({commentId: comment.commentId})
            if(data){
                data.videoId = comment.videoId
                data.commentId = comment.commentId
                data.parentId = comment.parentId
                data.authorName = comment.authorName
                data.text = comment.text
                data.likeCount = comment.likeCount
                data.publishedAt = comment.publishedAt
                await data.save()
            }
            else{
                await this.YoutubeComment.create({
                    videoId: comment.videoId,
                    commentId: comment.commentId,
                    parentId: comment.parentId,
                    authorName: comment.authorName,
                    text: comment.text,
                    likeCount: comment.likeCount,
                    publishedAt: comment.publishedAt,
                })
            }
            
        }catch(err){
            console.error(err)
        }
        
    }

    async createChannelId(channelId: string){
        try{
            let data = await this.YoutubeChannelId.findOne({channelId: channelId})
            if(!data){
                data = await this.YoutubeChannelId.create({
                    channelId: channelId
                })
            }  
            return [data, null]
        }catch(err){
            return [null, err]
        }
    }

    async getChannelIds(){
        try{
            let channelIds = await this.YoutubeChannelId.find({})
            return channelIds.map(channelId =>{
                return channelId.channelId
            })
        }catch(err){
            console.error(err)
        }
    }
}