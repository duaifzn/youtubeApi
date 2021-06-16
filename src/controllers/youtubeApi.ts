import YoutubeService from '../services/youtubeService'
import axios, {AxiosRequestConfig} from "axios"
import { Config } from '../config/config'
const config = Config[process.env.NODE_ENV]
const youtubeService = new YoutubeService()
const youtubeKey = config.youtubeKey;

export async function youtubeChannelData(channelId: string): Promise<void>{
    if(!channelId) return
    const baseUrl = 'https://www.youtube.com/watch?v=';
    // get playlistId
    const config1: AxiosRequestConfig = {
        method: 'get',
        url: `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${youtubeKey}`,
    }
    
    let res = await axios(config1)
    const playlistId = res.data.items[0].contentDetails.relatedPlaylists.uploads;
    //--------------

    //get video news
    let videoIds: string[] = []
    const config2: AxiosRequestConfig = {
        method: 'get',
        url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&playlistId=${playlistId}&key=${youtubeKey
        }&maxResults=50`,
    }
        
    res = await axios(config2)
    for await(const item of res.data.items){
        videoIds.push(item.contentDetails.videoId)
        await youtubeService.createVideo({
            videoId: item.contentDetails.videoId,
            href: baseUrl + item.snippet.resourceId.videoId,
            publishedAt: item.snippet.publishedAt,
            desc: item.snippet.description,
            img: item.snippet.thumbnails.default.url,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            webSite: 'youtube',
        });
    }
    //---------------

    //get video comments
    for await(const videoId of videoIds){
        let config3: AxiosRequestConfig = {
            method: 'get',
            url: `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&key=${youtubeKey}&order=relevance`
        }
        let res = await axios(config3)
        for await(const item of res.data.items){
            await youtubeService.createComment({
                videoId: item.snippet.videoId,
                commentId: item.id,
                parentId: null ,
                authorName: item.snippet.topLevelComment.snippet.authorDisplayName,
                text: item.snippet.topLevelComment.snippet.textOriginal,
                likeCount: item.snippet.topLevelComment.snippet.likeCount,
                publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
            })
            if(item.replies){
                for await(const reply of item.replies.comments){
                    await youtubeService.createComment({
                        videoId: reply.snippet.videoId,
                        commentId: reply.id,
                        parentId: reply.snippet.parentId,
                        authorName: reply.snippet.authorDisplayName,
                        text: reply.snippet.textOriginal,
                        likeCount: reply.snippet.likeCount,
                        publishedAt: reply.snippet.publishedAt,
                    })
                }
            }
        }
    }
    //---------------
}
