import InstagramService from "../services/instagramService";
import axios ,{ AxiosRequestConfig }from 'axios';
import { Config } from '../config/config';
const config = Config[process.env.NODE_ENV];
const sessionId = config.instagram.sessionId;

export default class InstagramApi extends InstagramService{

    async getProfileDetail(){
        const instagramUserNames = await super.getInstagramUserNames()
        for(let userName of instagramUserNames){
            //fetch url https://www.instagram.com/{userName}/?__a=1
            const config: AxiosRequestConfig = {
                method: 'get',
                url: `https://www.instagram.com/${userName}/?__a=1`,
                headers:{
                    'Cookie': `sessionid=${sessionId}`,
                    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
                }
            }
            let res = await axios(config)
            if(res.status !== 200){
                console.log(`status: ${res.status}`)
                continue
            }
            //write data to db
            const detail = res.data
            await super.createOrUpdateProfileDetail({
                userId: detail.graphql.user.id,
                userName: detail.graphql.user.username,
                fullName: detail.graphql.user.full_name,
                followerValue: detail.graphql.user.edge_followed_by.count,
                followingValue: detail.graphql.user.edge_follow.count,
                pictureUrl: detail.graphql.user.profile_pic_url?detail.graphql.user.profile_pic_url:null,
            })

        }
    }

    async getPostDetail(){
        let instagramIds = await super.getInstagramIds()
        for(let instagramId of instagramIds){
            //https://www.instagram.com/graphql/query/?query_id=17888483320059182&id={instagramId}&first=12&after={}
            const config: AxiosRequestConfig = {
                method: 'get',
                url: `https://www.instagram.com/graphql/query/?query_id=17888483320059182&id=${instagramId}&first=12`,
                headers:{
                    'Cookie': `sessionid=${sessionId}`,
                    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
                }
            }
            let res = await axios(config)
            if(res.status !== 200){
                console.log(`status: ${res.status}`)
                continue
            }
            //write data to db
            let posts = res.data.data.user.edge_owner_to_timeline_media.edges
            for(let post of posts){
                await super.createOrUpdateInstagramPost({
                    postId: post.node.id,
                    ownerId: post.node.owner.id,
                    shortCode: post.node.shortcode,
                    like: post.node.edge_media_preview_like.count,
                    comment: post.node.edge_media_to_comment.count,
                    content: post.node.edge_media_to_caption.edges[0]?post.node.edge_media_to_caption.edges[0].node.text:null,
                    pictureUrl: post.node.display_url
                })
            }
        }
    }
    async getPostComment(){
        //get post shortcodes
        let postIdCodes = await super.getIGPostIdAndShortcode()
        for(let postIdCode of postIdCodes){
            //https://www.instagram.com/graphql/query/?query_id=17852405266163336&shortcode=CPQyac5HHEs&first=100&after={}
            const config: AxiosRequestConfig = {
                method: 'get',
                url: `https://www.instagram.com/graphql/query/?query_id=17852405266163336&shortcode=${postIdCode.shortCode}&first=100`,
                headers:{
                    'Cookie': `sessionid=${sessionId}`,
                    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
                }
            }
            let res = await axios(config)
            if(res.status !== 200){
                console.log(`status: ${res.status}`)
                continue
            }
            if(res.data.data.shortcode_media == null){
                continue
            }
            let comments = res.data.data.shortcode_media.edge_media_to_comment.edges
            //write data to db
            for(let comment of comments){
                await super.createOrUpdateInstagramComment({
                    commentId: comment.node.id,
                    postId: postIdCode.postId,
                    ownerId: postIdCode.ownerId,
                    shortCode: postIdCode.shortCode,
                    commenterId: comment.node.owner.id,
                    commenterName: comment.node.owner.username,
                    commenterPicture: comment.node.owner.profile_pic_url,
                    content: comment.node.text,
                })
            }      
        }   
    }
}


// const instagramApi = new InstagramApi()
// async function aa(){
//     await instagramApi.getPostComment()
// }

// setTimeout(aa,5000)