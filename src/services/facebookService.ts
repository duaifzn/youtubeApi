import Mongo from "../models/_index";

export default class FacebookService extends Mongo {
    constructor(){
        super()
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

    async getOneFacebookPost(position: number){
        let posts = await this.FacebookPost.find({}).sort({_id: -1}).skip(position).limit(1)
        return posts[0];
    }

    async getOneFacebookPostByPostId(postId: string){
        let post = await this.FacebookPost.findOne({postId: postId})
        return post;
    }

    async getFacebookPostCount(): Promise<number>{
        return await this.FacebookPost.countDocuments({})
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

    async getOneFacebookComment(position: number){
        let posts = await this.FacebookComment.find({}).sort({_id: -1}).skip(position).limit(1)
        return posts[0];
    }

    async getFacebookCommentCount(): Promise<number>{
        return await this.FacebookComment.countDocuments({})
    }

    async createOrUpdateFacebookProfile(profile:{
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