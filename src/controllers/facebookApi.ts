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
    phone: puppeteer.Device
    constructor(){
        super();
        this.page = null
        this.browser = null
        this.phone = puppeteer.devices['Galaxy S III']
    }
    async login(){
        try{
            await this.loginCookies()
        }catch(err){
            console.error(err)
            await this.loginEmail()
        }
    }
    async loginEmail(){
        const browser = await puppeteer.launch({
            headless: headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
          })
        const page = await browser.newPage()
        await page.emulate(this.phone)
        await page.goto('https://m.facebook.com/')
        await page.waitForSelector('#m_login_email')
        await page.type('#m_login_email', fbEmail, {delay: 10})
        await page.waitForSelector('#m_login_password')
        await page.type('#m_login_password', fbPassword, {delay: 10})
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
        try{
            const page = await browser.newPage()
            await page.emulate(this.phone)
            await page.setCookie(...JSON.parse(cookies))
            await page.goto('https://m.facebook.com/')
            await page.waitForSelector('div[data-sigil="messenger_icon"]', {timeout: 3000})
            this.page = page;
            this.browser = browser;
        }catch(err){
            await browser.close()
            throw new Error('login with cookies fail.')
        }
    }
    async getPostIds(){
        let facebookIds = await super.getFacebookIds()
        for(const facebookId of facebookIds){
            await this.page.goto(`https://m.facebook.com/${facebookId}`)
            let postsValue = 0
            while(postsValue < 5){
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
            let imageUrlFromStyle = await this.page.evaluate(() =>{
                let img = document.querySelectorAll('div.story_body_container i[role="img"]')[2]
                if(!img){
                    return null
                }
                let style = img.getAttribute('style')
                if(!style){
                    return null
                }
                let originImgUrl = style.slice(style.indexOf("('")+2, style.indexOf("')"))
                let imgUrl = originImgUrl.replace(/\s/g,'').replace(/\\/g, '\\u00')
                return eval("'" + imgUrl + "'")
            })

            let title = detail.articleBody || detail.description || null
            let profileImgUrl = detail.author?detail.author.image:null
            let imgUrl = detail.image?detail.image.contentUrl:imageUrlFromStyle
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
            if(profileImgUrl){
                await this.updateProfileImgUrl(facebookPostAndOwnerId.ownerId, profileImgUrl)
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

    getUrlFromStyle(style: string): string{
        let originImgUrl = style.slice(style.indexOf("('")+2, style.indexOf("')"))
        let imgUrl = originImgUrl.replace(/\s/g,'').replace(/\\/g, '\\u00')
        return eval("'" + imgUrl + "'")
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
            await this.page.waitForSelector('i[data-sigil="cover-photo orientation-resizable"]')
            await this.page.waitForSelector('meta[name="description"]')
            let [name, backgroundImgUrl, likeValue] = await this.page.evaluate(() =>{
                let name = document.querySelector('title').textContent
                if(name.includes(' - 首頁')) {
                    name = name.replace(' - 首頁', '')
                }
                let backgroundImg = document.querySelector('i[data-sigil="cover-photo orientation-resizable"]').getAttribute('style')
                let backgroundImgUrl = backgroundImg.slice(backgroundImg.indexOf("'")+1, backgroundImg.lastIndexOf("'"))
                
                let description = document.querySelector('meta[name="description"]').getAttribute('content')
                let likeValue = description.split('。')[1].split('·')[0].match(/\d/g).join('')
                return [name, backgroundImgUrl, likeValue]
            })
            await super.createOrUpdateFacebookProfile({
                profileId: facebookId,
                name: name,
                likeValue: Number(likeValue),
                backgroundImgUrl: backgroundImgUrl
            })
        }
    }
    async updateProfileFollowerValue(profileId: string, followerValue: number){
        await super.createOrUpdateFacebookProfile({
            profileId: profileId,
            followerValue: followerValue,
        })
    }
    async updateProfileImgUrl(profileId: string, profileImgUrl: string){
        await super.createOrUpdateFacebookProfile({
            profileId: profileId,
            profileImgUrl: profileImgUrl,
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
