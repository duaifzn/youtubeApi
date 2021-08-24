import nodejieba, { ExtractResult } from 'nodejieba';
//import { Mixin } from 'ts-mixer';
import FacebookService from '../services/facebookService';
import WordpressService from '../services/wordpressService';
import { sequelize } from '../models/wordpress/_index';
const wordpressService = new WordpressService()
export default class FbToWordpress extends FacebookService {
    constructor(){
        super()
    }
    async oneFBPostToWordpressDb(position: number){
        try{
            //get one post from mongodb
            let post = await super.getOneFacebookPost(position)
            //get keyword
            let keywords = this.getKeywords(post.title)
            //write data to wordpress db
            let wpPost = await wordpressService.createOrUpdatePostToWordpress(post, keywords)
            //write wordpress post id to mongodb
            post.wpPostId = wpPost.ID
            await post.save()
        }catch(err){
            console.error(err)
        }
    }

    async oneFBCommentToWordpressDb(position: number){
        //get one comment from mongodb
        let comment = await super.getOneFacebookComment(position)
        let post = await super.getOneFacebookPostByPostId(comment.postId)
        //write to wordpress db
        let wpComment = await wordpressService.createOrUpdateWPComment(post.wpPostId, comment)
        //write wordpress comment id to mongodb
        comment.wpCommentId = wpComment.comment_ID
        await comment.save()
    }


    getKeywords(text: string): ExtractResult[]{
        const max = 5;
        const results = nodejieba.extract(text, max)
        return results
    }

    async allFBToWordpressDb(){
        let fbPostCount = await super.getFacebookPostCount()
        for(let i=0; i<fbPostCount; i++){
            await this.oneFBPostToWordpressDb(i)
        }
        let fbCommentCount = await super.getFacebookCommentCount()
        for(let j=0; j<fbCommentCount; j++){
            await this.oneFBCommentToWordpressDb(j)
        }

    }
}

// sequelize.authenticate()
//     .then(async () => {
//       console.log("connected to wordpress db.")
//     }).catch((err) => {
//       console.log("connect wordpress db fail!!")
//       console.error(err)
//     });

// let test = new FbToWordpress()
// async function aa(){
//     await test.allFBToWordpressDb()
// }
// setTimeout(aa, 10000)
