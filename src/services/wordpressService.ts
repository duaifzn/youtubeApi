import WpPost from "../models/wordpress/wpPost";
import WpTerm from "../models/wordpress/wpTerm";
import WpTermTaxonomy from "../models/wordpress/wpTermTaxonomy";
import WpTermRelationship from "../models/wordpress/wpTermRelationship";
import WpComment from "../models/wordpress/wpComment";
import { ExtractResult } from 'nodejieba';

export default class WordpressService {
    public async createPostToWordpress(
        post: {
            postId: string,
            ownerId: string,
            title: string | null,
            img: string | null,
            like: number,
            share: number,
            comment: number,
            wpPostId: number | null, 
        },
        keywords: ExtractResult[]
    ){
        let postAuthor = 1;
        let postTitle = this.handlePostTitle(post.title)
        let postContent = this.handlePostContent(post)
 
        let newWpPost = await WpPost.create({
            post_author: postAuthor,
            post_title: postTitle,
            post_content: postContent,
            post_excerpt: postTitle,
            post_status: 'publish',
            post_type: 'post',
            post_name: postTitle,
        })
        //write post image to wordpress
        //write keywords to wordpress
        for(let keyword of keywords){
            await this.createOneLabel(keyword.word, newWpPost.ID)
        }
        return newWpPost
    }

    public handlePostTitle(context: string): string{
        if(!context){
            return null
        }
        else if(context.length <= 15){
            return context
        }
        else{
            return context.slice(0,15)
        }
    }

    public handlePostContent(post: {
        postId: string,
        ownerId: string,
        title: string | null,
        img: string | null,
        like: number,
        share: number,
        comment: number,
        wpPostId: number | null, 
    }): string
    {
        return `<p>${post.title}</p>
        <img src='${post.img}'></img>
        `
    }

    public async createOneLabel(labelName: string, wpPostId: number){
        let [label, created] = await WpTerm.findOrCreate({
                where: { name: labelName }
            })

        let [wpTermTaxonomy, created2] = await WpTermTaxonomy.findOrCreate({
                where: { term_id: label.term_id },
                defaults:{
                    term_id: label.term_id,
                    taxonomy: 'post_tag' 
                }
            })
        
        await WpTermRelationship.create({
            object_id: wpPostId,
            term_taxonomy_id: wpTermTaxonomy.term_taxonomy_id,
        })
    }
}