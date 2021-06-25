import mongoose, { Model } from 'mongoose';
import { facebookIdSchema, IFacebookId } from '../models/facebookId';
import { facebookPostSchema, IFacebookPost } from '../models/facebookPost';
import { Config } from '../config/config'
const config = Config[process.env.NODE_ENV];
const mongoUri = config.mongoUri;

export default class FacebookService{
    FacebookId: Model<IFacebookId >;
    FacebookPost: Model<IFacebookPost>;

    constructor(){
        this.FacebookId = null
        this.FacebookPost = null
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

    async getFacebookPostAndOwnerIds(){
        let data = await this.FacebookPost.find({})
        return data.map(d => {
            return { 
                postId: d.postId,
                ownerId: d.ownerId
            }
        })
    }
}