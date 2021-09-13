import facebookIdSeed from "./facebookId"
import instagramUserNameSeed from "./instagramUserName"
import userSeed from "./user"
import youtubeIdSeed from "./youtubeId";
import mongoose from "mongoose";
import { Config } from "../config/config"
const config = Config[process.env.NODE_ENV];
const mongoDb = config.mongoDb;

(async () =>{
    try{
        await mongoose.connect(mongoDb.mongoUri, {
            authSource: mongoDb.authSource,
            user: mongoDb.user,
            pass: mongoDb.pass,
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        })
        console.log('MongoDB connected!!');
        if(process.env.NODE_ENV == 'dev'){
            await facebookIdSeed();
            await instagramUserNameSeed();
            await userSeed();
            await youtubeIdSeed()
            process.exit(0)
        }else if(process.env.NODE_ENV == 'prod'){
            await userSeed();
            process.exit(0)
        }
    }catch(err){
        console.log('Failed to connect to MongoDB:\n', err);
    }
})()