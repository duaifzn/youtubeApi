import WpPost, { WpPostModel } from "../models/wordpress/wpPost";
import WpTerm from "../models/wordpress/wpTerm";
import WpTermTaxonomy from "../models/wordpress/wpTermTaxonomy";
import WpTermRelationship from "../models/wordpress/wpTermRelationship";
import WpComment from "../models/wordpress/wpComment";
import { ExtractResult } from 'nodejieba';
export default class WordpressService {
    async createOrUpdatePostToWordpress(
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
        //findOrCreate
        let newWpPost = await WpPost.findOne({
            where:{ ID: post.wpPostId }
        })
        if(!newWpPost){
            newWpPost = await WpPost.create({
                post_author: postAuthor,
                post_title: postTitle,
                post_content: postContent,
                post_excerpt: postTitle,
                post_status: 'publish',
                post_type: 'post',
            })
        }
        //update
        else{
            newWpPost.post_author = postAuthor
            newWpPost.post_title = postTitle
            newWpPost.post_content = postContent
            newWpPost.post_excerpt = postTitle
            newWpPost.post_status = 'publish'
            newWpPost.post_type = 'post'
            await newWpPost.save()
        }
        //write post image to wordpress
        //write keywords to wordpress
        for(let keyword of keywords){
            await this.createOneTag(keyword.word, newWpPost.ID)
        }
        return newWpPost
       
    }

    handlePostTitle(context: string): string{
        if(!context){
            return null
        }
        else if(context.length <= 10){
            return context
        }
        else{
            //use Array.from() because might have emoji
            let temp = Array.from(context)
            return temp.slice(0,10).join('')
        }
    }

    handlePostContent(post: {
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

    async createOneTag(tagName: string, wpPostId: number){
        let [tag, created] = await WpTerm.findOrCreate({
                where: { name: tagName },
                defaults:{
                    name: tagName
                }
            })

        let [wpTermTaxonomy, created2] = await WpTermTaxonomy.findOrCreate({
                where: { term_id: tag.term_id },
                defaults:{
                    term_id: tag.term_id,
                    taxonomy: 'post_tag' 
                }
            })
        
        let [wpTermRelationship, created3] = await WpTermRelationship.findOrCreate({
            where: { 
                object_id: wpPostId,
                term_taxonomy_id: wpTermTaxonomy.term_taxonomy_id,
             },
             defaults: {
                object_id: wpPostId,
                term_taxonomy_id: wpTermTaxonomy.term_taxonomy_id,
             }
            
        })
    }

    async createOrUpdateWPComment(
        wpPostId: number,
        comment: {
            commentId: string
            postId: string,
            ownerId: string,
            commenter: string,
            content: string,
            wpCommentId: number,
    }){
        let [newWpComment, created] = await WpComment.findOrCreate({
            where: { comment_ID: comment.wpCommentId },
            defaults:{
                comment_post_ID: wpPostId,
                comment_author: comment.commenter || 'unknownUser',
                comment_content: comment.content,
            }
        })
        if(!created){
            newWpComment.comment_post_ID = wpPostId
            newWpComment.comment_author = comment.commenter || 'unknownUser'
            newWpComment.comment_content = comment.content
            await newWpComment.save()
        }
        return newWpComment
    }
}