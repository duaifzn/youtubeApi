import mongoose, { Model } from 'mongoose';
import { instagramProfileSchema, IInstagramProfile } from '../models/instagramProfile';
import { instagramUserNameSchema, IInstagramUserName } from '../models/instagramUserName'; 
import { instagramPostSchema, IInstagramPost} from '../models/instagramPost';
import { instagramCommentSchema, IInstagramComment } from '../models/instagramComment';
import { Config } from '../config/config';
const config = Config[process.env.NODE_ENV];
const mongoUri = config.mongoUri;

export default class InstagramService{
    InstagramProfile: Model<IInstagramProfile>
    InstagramUserName: Model<IInstagramUserName>
    InstagramPost: Model<IInstagramPost>
    InstagramComment: Model<IInstagramComment>
    
    constructor(){
        this.InstagramProfile = null
        this.InstagramUserName = null
        this.InstagramPost = null
        this.InstagramComment = null
        this.connectMongo()
    }
    connectMongo(){
        mongoose.connect(mongoUri,{
            authSource: 'admin',
            user: 'eagle',
            pass: 'eagle-eye',
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        })
        const db = mongoose.connection
        db.once('open', () =>{
            console.log('mongodb connect!')
            this.InstagramProfile = db.model<IInstagramProfile>('InstagramProfile', instagramProfileSchema)
            this.InstagramUserName = db.model<IInstagramUserName>('InstagramUserName', instagramUserNameSchema)
            this.InstagramPost = db.model<IInstagramPost>('InstagramPostSchema', instagramPostSchema)
            this.InstagramComment = db.model<IInstagramComment>('InstagramCommentSchema', instagramCommentSchema)
        })
        db.on('error', () =>{
            console.log('mongodb error!!')
        })
    }

    async createInstagramUserName(userName: string){
        try{
            let data = await this.InstagramUserName.findOne({userName: userName})
            if(!data){
                data = await this.InstagramUserName.create({
                    userName: userName
                })
            }
            return [data, null]
        }catch(err){
            return [null, err]
        }        
    }

    async getInstagramUserNames(): Promise<any[]>{
        let data = await this.InstagramUserName.find({})
        return data.map(d =>d.userName)
    }

    async createOrUpdateProfileDetail(profile: {
        userId: string
        userName: string
        fullName: string
        followerValue: number
        followingValue: number
        pictureUrl?: string
    }){
        let data = await this.InstagramProfile.findOne({userId: profile.userId})
        if(data){
            data.userName = profile.userName
            data.fullName = profile.fullName
            data.followerValue = profile.followerValue
            data.followingValue = profile.followingValue
            data.pictureUrl = profile.pictureUrl? profile.pictureUrl:data.pictureUrl
            await data.save()
        }else{
            await this.InstagramProfile.create({
                userId: profile.userId,
                userName: profile.userName,
                fullName: profile.fullName,
                followerValue: profile.followerValue,
                followingValue: profile.followingValue,
                pictureUrl: profile.pictureUrl?profile.pictureUrl:null,
            })
        }
    }
    
    async getInstagramIds(){
        let data = await this.InstagramProfile.find({})
        return data.map(d => d.userId)
    }

    async createOrUpdateInstagramPost(post: {
        postId: string
        ownerId: string
        shortCode: string
        like?: number
        comment?: number
        content?: string
        pictureUrl?: string
    }){
        let data = await this.InstagramPost.findOne({postId: post.postId, ownerId: post.ownerId})
        if(data){
            data.shortCode = post.shortCode?post.shortCode:data.shortCode
            data.like = post.like?post.like:data.like
            data.comment = post.comment?post.comment:data.comment
            data.content = post.content?post.content:data.content
            data.pictureUrl = post.pictureUrl?post.pictureUrl:data.pictureUrl
        }else{
            await this.InstagramPost.create({
                postId: post.postId,
                ownerId: post.ownerId,
                shortCode: post.shortCode,
                like: post.like?post.like:null,
                comment: post.comment?post.comment:null,
                content: post.content?post.content:null,
                pictureUrl: post.pictureUrl?post.pictureUrl:null
            })
        }
    }

    async getIGPostIdAndShortcode(){
        let data = await this.InstagramPost.find({})
        return data.map(d =>{
            return{
                postId: d.postId,
                shortCode: d.shortCode,
                ownerId: d.ownerId,
            }
        })
    }

    async createOrUpdateInstagramComment(comment:{
        commentId: string
        postId: string
        ownerId: string
        shortCode: string
        commenterId: string
        commenterName: string
        commenterPicture?: string
        content: string
    }){
        let data = await this.InstagramComment.findOne({commentId: comment.commentId})
        if(data){
            data.commentId = comment.commentId
            data.postId = comment.postId
            data.ownerId = comment.ownerId
            data.shortCode = comment.shortCode
            data.commenterId = comment.commenterId
            data.commenterPicture = comment.commenterPicture?comment.commenterPicture:data.commenterPicture
            data.content = comment.content
            await data.save()
        }else{
            await this.InstagramComment.create({
                commentId: comment.commentId,
                postId: comment.postId,
                ownerId: comment.ownerId,
                shortCode: comment.shortCode,
                commenterId: comment.commenterId,
                commenterPicture: comment.commenterPicture,
                content: comment.content,
            })
        }
    }
}