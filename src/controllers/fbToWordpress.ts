import nodejieba, { ExtractResult } from 'nodejieba';
import { Mixin } from 'ts-mixer';
import FacebookService from '../services/facebookService';
import WordpressService from '../services/wordpressService';

export default class FbToWordpress extends Mixin(FacebookService, WordpressService){

    public async onePostToWordpressDb(){
        //get one post from mongodb
        let post = await super.getOneFacebookPost()
        //get keyword
        let keywords = this.getKeywords(post.title)
        //write data to wordpress db
        let wpPost = await super.createPostToWordpress(post, keywords)
        //write wordpress post id to mongodb
        post.wpPostId = wpPost.ID
        await post.save()
        
    }

    public async oneCommentToWordpressDb(){
        //get one comment from mongodb
        let comment = await super.getOneFacebookComment()
        //write to wordpress db
        
        //write wordpress comment id to mongodb
    }


    public getKeywords(text: string): ExtractResult[]{
        const max = 5;
        const results = nodejieba.extract(text, max)
        return results
    }
}