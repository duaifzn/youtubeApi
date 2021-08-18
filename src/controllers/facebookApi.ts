import puppeteer from 'puppeteer';
import fs from 'fs';
import FacebookService from '../services/facebookService';
import cheerio from 'cheerio';
import { Config } from '../config/config'
const config = Config[process.env.NODE_ENV]
const fbEmail = config.facebook.email
const fbPassword = config.facebook.password
const headless = config.puppeteer.headless
export default class FacebookApi extends FacebookService{
    page: puppeteer.Page
    browser: puppeteer.Browser

    constructor(){
        super();
        this.page = null
        this.browser = null
    }
    async login(){
        try{
            await this.loginCookies()
        }catch(err){
            console.error('loginCookies error')
            await this.loginEmail()
        }
    }
    async loginEmail(){
        const browser = await puppeteer.launch({
            headless: headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
          })
        const page = await browser.newPage()
        await page.goto('https://zh-tw.facebook.com/')
        await page.waitForSelector('#email')
        await page.type('#email', fbEmail, {delay: 10})
        await page.waitForSelector('#pass')
        await page.type('#pass', fbPassword, {delay: 10})
        await page.click('button[name="login"]');
        await page.waitForTimeout(5000);
        let cookie = await page.cookies();
        fs.writeFileSync('./cookies.json', JSON.stringify(cookie));
        this.page = page;
        this.browser = browser;
    }
    async loginCookies(){
        let cookies = fs.readFileSync('./cookies.json', 'utf-8')
        const browser = await puppeteer.launch({
            headless: headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
          })
        const page = await browser.newPage()
        await page.setCookie(...JSON.parse(cookies))
        await page.goto('https://m.facebook.com/')
        this.page = page;
        this.browser = browser;
       
    }
    async getPostIds(){
        let facebookIds = await super.getFacebookIds()
        for(const facebookId of facebookIds){
            await this.page.goto(`https://m.facebook.com/${facebookId}`)
            let postsValue = 0
            while(postsValue < 10){
                await this.page.mouse.wheel({ deltaY: 100 });
                postsValue = await this.page.evaluate(() =>{
                    let articles = document.getElementsByTagName('article')
                    return articles.length
                })
            }
            const $ = cheerio.load(await this.page.content())
            let posts = $('article').map((i, elem) =>{
                return JSON.parse($(elem).attr('data-ft'))
            })
            for(let post of posts){
                if(facebookId != post.page_id) continue
                await super.createOrUpdateFacebookPost({
                    postId: post.top_level_post_id,
                    ownerId: post.page_id
                })
            }
        }
    }

    async getPostDetail(){
        //get post ids
        let facebookPostAndOwnerIds = await super.getFacebookPostAndOwnerIds()
        for(const facebookPostAndOwnerId of facebookPostAndOwnerIds){
            //get detail from https://m.facebook.com/story.php?story_fbid=351611619656373&id=100044226139684
            await this.page.goto(`https://m.facebook.com/story.php?story_fbid=${facebookPostAndOwnerId.postId}&id=${facebookPostAndOwnerId.ownerId}`)
            try{
                await this.page.waitForSelector('script[type="application/ld+json"]',{timeout: 5000})
            }catch(err){
                console.error(err)
                //write data to db
                await super.createOrUpdateFacebookPost({
                    postId: facebookPostAndOwnerId.postId,
                    ownerId: facebookPostAndOwnerId.ownerId,
                    title: 'can not catch post data!!',
                })
                continue
            }
            let detail = await this.page.evaluate(() =>{
                let datas = document.querySelectorAll('script[type="application/ld+json"]')
                let data = datas[datas.length-1].innerHTML
                return JSON.parse(data)
            })
           
            let titleOption = detail.articleBody || detail.description
            let title = titleOption?titleOption:null
            let imgUrl = detail.image?detail.image[0].contentUrl:null
            let commentCount = detail.commentCount?detail.commentCount:null
            let likeCount = null
            let shareCount = null
            let followCount = null

            detail.interactionStatistic.forEach((d, index) =>{
                if(JSON.stringify(d).includes('Like')){
                    likeCount = detail.interactionStatistic[index].userInteractionCount
                }
                if(JSON.stringify(d).includes('Share')){
                    shareCount = detail.interactionStatistic[index].userInteractionCount
                }
                if(JSON.stringify(d).includes('Follow')){
                    followCount = detail.interactionStatistic[index].userInteractionCount
                }
            })
            
            //write data to db
            if(followCount){
                await this.updateProfileFollowerValue(facebookPostAndOwnerId.ownerId, followCount)
            }
            await super.createOrUpdateFacebookPost({
                postId: facebookPostAndOwnerId.postId,
                ownerId: facebookPostAndOwnerId.ownerId,
                title: title,
                img: imgUrl,
                like: likeCount,
                share: shareCount,
                comment: commentCount,
            })
        }
    }
    async getPostComment(){
        //get post ids
        let facebookPostAndOwnerIds = await super.getFacebookPostAndOwnerIds()
        for(let facebookPostAndOwnerId of facebookPostAndOwnerIds){
            await this.page.goto(`https://m.facebook.com/story.php?story_fbid=${facebookPostAndOwnerId.postId}&id=${facebookPostAndOwnerId.ownerId}`)
            //get comments
            let comments = await this.page.evaluate(() =>{
                let ans = []
                let comments = document.querySelectorAll('div[data-sigil="comment"]')
                comments.forEach(comment =>{
                    let commenter = 'unknown'
                    if(comment.querySelector('div:nth-child(2) > div > div > div > a')){
                        commenter = comment.querySelector('div:nth-child(2) > div > div > div > a').textContent
                    }
                    else if(comment.querySelector('div:nth-child(2) > div > div > a')){
                        commenter = comment.querySelector('div:nth-child(2) > div > div > a').lastChild.textContent
                    }
                    else if(comment.querySelector('div:nth-child(2) > div > a')){
                        commenter = comment.querySelector('div:nth-child(2) > div > a').lastChild.textContent
                    }
                    ans.push({
                        id: comment.id,
                        commenter: commenter,
                        content: comment.querySelector('div[data-sigil="comment-body"]').textContent,
                    })
                })
                return ans
            })
            
            //write comment to db
            for(let comment of comments){
                await super.createOrUpdateFacebookComment({
                    commentId: comment.id,
                    postId: facebookPostAndOwnerId.postId,
                    ownerId: facebookPostAndOwnerId.ownerId,
                    commenter: comment.commenter,
                    content: comment.content,
                })
            }
            
        }
        
    }
    async getProfileDetail(){
        let facebookIds = await super.getFacebookIds()
        for(let facebookId of facebookIds){
            await this.page.goto(`https://m.facebook.com/${facebookId}`)
            let name = await this.page.evaluate(() =>{
                let name = document.querySelector('title').textContent
                if(name.includes(' - 首頁')) {
                    name = name.replace(' - 首頁', '')
                }
                return name
            })
            await super.createOrUpdateFacebookProfile({
                profileId: facebookId,
                name: name
            })
        }
    }
    async updateProfileFollowerValue(profileId: string, followerValue: number){
        await super.createOrUpdateFacebookProfile({
            profileId: profileId,
            followerValue: followerValue,
        })
    }
    async browserClose(){
        await this.browser.close()
        this.browser = null
        this.page = null
    }
}

// let a = new FacebookApi()
// async function aa(){
//     console.log(await a.getPostIds())
// }
// setTimeout(aa, 5000)
