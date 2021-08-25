import { Youtube } from "../models/youtube";
import { YoutubeChannelId } from "../models/youtubeChannelId";
import { YoutubeComment } from "../models/youtubeComment";
export default class YoutubeService {
    
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
                let data = await Youtube.findOne({videoId: video.videoId})
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
                    await Youtube.create({
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
            let data = await YoutubeComment.findOne({commentId: comment.commentId})
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
                await YoutubeComment.create({
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
            let data = await YoutubeChannelId.findOne({channelId: channelId})
            if(!data){
                data = await YoutubeChannelId.create({
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
            let channelIds = await YoutubeChannelId.find({})
            return channelIds.map(channelId =>{
                return channelId.channelId
            })
        }catch(err){
            console.error(err)
        }
    }
}