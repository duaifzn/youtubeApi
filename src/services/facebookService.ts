import mongoose, { Model } from 'mongoose';
import { facebookIdSchema, IFacebookId } from '../models/facebookId';
import { facebookPostSchema, IFacebookPost } from '../models/facebookPost';
import { facebookCommentSchema, IFacebookComment } from '../models/facebookComment';
import { facebookProfileSchema, IFacebookProfile } from '../models/facebookProfile';
import { Config } from '../config/config'
const config = Config[process.env.NODE_ENV];
const mongoUri = config.mongoUri;

export default class FacebookService{
    FacebookId: Model<IFacebookId >;
    FacebookPost: Model<IFacebookPost>;
    FacebookComment: Model<IFacebookComment>
    FacebookProfile: Model<IFacebookProfile>

    constructor(){
        this.FacebookId = null
        this.FacebookPost = null
        this.FacebookComment = null
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
            this.FacebookId = db.model<IFacebookId>('FacebookId', facebookIdSchema)
            this.FacebookPost = db.model<IFacebookPost>('FacebookPost', facebookPostSchema)
            this.FacebookComment = db.model<IFacebookComment>('FacebookComment', facebookCommentSchema)
            this.FacebookProfile = db.model<IFacebookProfile>('FacebookProfile', facebookProfileSchema)
        })
        db.on('error', () =>{
            console.log('mongodb error!!')
        })
    }

    async createFacebookId(facebookId: string){
        try{
            let data = await this.FacebookId.findOne({id: facebookId})
            if(!data){
                data = await this.FacebookId.create({
                    id: facebookId
                })
            }  
            return [data, null]
        }catch(err){
            return [null, err]
        }
    }

    async getFacebookIds(): Promise<any[]>{
        let data = await this.FacebookId.find({})
        return data.map(d => d.id)
    }

    async createOrUpdateFacebookPost(post: {
        postId: string,
        ownerId: string,
        title?: string,
        img?: string,
        like?: number,
        share?: number,
        comment?: number
    }){
        let data = await this.FacebookPost.findOne({postId: post.postId})
        if(data){
            data.title = post.title?post.title: data.title
            data.img = post.img?post.img: data.img
            data.like = post.like?post.like: data.like
            data.share = post.share?post.share: data.share
            data.comment = post.comment?post.comment: data.comment
            await data.save()
        }else{
            await this.FacebookPost.create({
                postId: post.postId,
                ownerId: post.ownerId,
                title: post.title?post.title:null,
                img: post.img?post.img:null,
                like: post.like?post.like:0,
                share: post.share?post.share:0,
                comment: post.comment?post.comment:0
            })
        }
    }

    async getProfileAllPost(profileId: string){
        try{
            let datas = await this.FacebookPost.find({ownerId: profileId})
            return [datas, null]
        }catch(err){
            return [null, err]
        }
        
    }

    async getFacebookPostAndOwnerIds(){
        let data = await this.FacebookPost.find({})
        return data.map(d => {
            return { 
                postId: d.postId,
                ownerId: d.ownerId
            }
        })
    }

    async createOrUpdateFacebookComment(comment: {
        commentId: string
        postId: string,
        ownerId: string,
        commenter?: string,
        content?: string
    }){
        let data = await this.FacebookComment.findOne({
            commentId: comment.commentId,
            postId: comment.postId,
            ownerId: comment.ownerId,
        })
        if(data){
            data.commenter = comment.commenter?comment.commenter:data.commenter
            data.content = comment.content?comment.content:data.content
            await data.save()
        }else{
            await this.FacebookComment.create({
                commentId: comment.commentId,
                postId: comment.postId,
                ownerId: comment.ownerId,
                commenter: comment.commenter?comment.commenter:null,
                content: comment.content?comment.content:null
            })
        }
    }

    async getPostAllComment(profileId: string, postId: string){
        try{
            let datas = await this.FacebookComment.find({
                postId: postId,
                ownerId: profileId,})
            return [datas, null]
        }catch(err){
            return [null, err]
        }
    }

    async createFacebookProfile(profile:{
        profileId: string
        name?: string
        followerValue?: number
        likeValue?: number
    }){
        let data = await this.FacebookProfile.findOne({profileId: profile.profileId})
        if(data){
            data.name = profile.name?profile.name:data.name
            data.followerValue = profile.followerValue?profile.followerValue:data.followerValue
            data.likeValue = profile.likeValue?profile.likeValue:data.likeValue
            await data.save()
        }else{
            await this.FacebookProfile.create({
                profileId: profile.profileId,
                name: profile.name,
                followerValue: profile.followerValue?profile.followerValue:null,
                likeValue: profile.likeValue?profile.likeValue:null,
            })
        }
    }

    async getAllFacebookProfile(){
        try{
            let datas = await this.FacebookProfile.find({})
            return [datas, null]
        }catch(err){
            return [null, err]
        }
        
    }
}