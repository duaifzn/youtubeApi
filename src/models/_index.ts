import mongoose, { Model } from 'mongoose';
import { facebookCommentSchema, IFacebookComment } from "./facebookComment";
import { facebookIdSchema, IFacebookId } from "./facebookId";
import { facebookPostSchema, IFacebookPost } from "./facebookPost";
import { facebookProfileSchema, IFacebookProfile } from "./facebookProfile";
import { instagramProfileSchema, IInstagramProfile } from '../models/instagramProfile';
import { instagramCommentSchema, IInstagramComment } from "./instagramComment";
import { instagramPostSchema, IInstagramPost } from "./instagramPost";
import { instagramUserNameSchema, IInstagramUserName } from "./instagramUserName";
import { youtubeSchema, IYoutube } from "./youtube";
import { youtubeChannelIdSchema, IYoutubeChannelId } from "./youtubeChannelId";
import { youtubeCommentSchema, IYoutubeComment } from "./youtubeComment";
import { Config } from '../config/config'
const config = Config[process.env.NODE_ENV];
const mongoDb = config.mongoDb;

export default class Mongo {
    FacebookId: Model<IFacebookId>
    FacebookPost: Model<IFacebookPost>
    FacebookComment: Model<IFacebookComment>
    FacebookProfile: Model<IFacebookProfile>
    InstagramProfile: Model<IInstagramProfile>
    InstagramUserName: Model<IInstagramUserName>
    InstagramPost: Model<IInstagramPost>
    InstagramComment: Model<IInstagramComment>
    Youtube: Model<IYoutube>;
    YoutubeComment: Model<IYoutubeComment>;
    YoutubeChannelId: Model<IYoutubeChannelId>;
    constructor(){
        this.FacebookId = null
        this.FacebookPost = null
        this.FacebookComment = null
        this.FacebookProfile = null
        this.InstagramProfile = null
        this.InstagramUserName = null
        this.InstagramPost = null
        this.InstagramComment = null
        this.Youtube = null
        this.YoutubeComment = null
        this.YoutubeChannelId = null
        this.connectMongo()
    }
    connectMongo(){
        mongoose.connect(mongoDb.mongoUri, {
            authSource: mongoDb.authSource,
            user: mongoDb.user,
            pass: mongoDb.pass,
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
                this.InstagramProfile = db.model<IInstagramProfile>('InstagramProfile', instagramProfileSchema)
                this.InstagramUserName = db.model<IInstagramUserName>('InstagramUserName', instagramUserNameSchema)
                this.InstagramPost = db.model<IInstagramPost>('InstagramPostSchema', instagramPostSchema)
                this.InstagramComment = db.model<IInstagramComment>('InstagramCommentSchema', instagramCommentSchema)
                this.Youtube = db.model<IYoutube>('Youtube', youtubeSchema)
                this.YoutubeComment = db.model<IYoutubeComment>('YoutubeComment', youtubeCommentSchema)
                this.YoutubeChannelId = db.model<IYoutubeChannelId>('YoutubeChannelId', youtubeChannelIdSchema)
            })
            db.on('error', () =>{
                console.log('mongodb error!!')
            })
    }
}