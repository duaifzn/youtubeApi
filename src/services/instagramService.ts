import mongoose, { Model } from 'mongoose';
import { instagramProfileSchema, IInstagramProfile } from '../models/instagramProfile';
import { instagramUserNameSchema, IInstagramUserName } from '../models/instagramUserName'; 
import { Config } from '../config/config';
const config = Config[process.env.NODE_ENV];
const mongoUri = config.mongoUri;

export default class InstagramService{
    InstagramProfile: Model<IInstagramProfile>
    InstagramUserName: Model<IInstagramUserName>

    constructor(){
        this.InstagramProfile = null
        this.InstagramUserName = null
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
}