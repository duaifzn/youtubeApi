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
}


// const instagramApi = new InstagramApi()
// async function aa(){
//     await instagramApi.getProfileDetail()
// }

// setTimeout(aa,5000)