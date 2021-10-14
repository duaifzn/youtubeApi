import FacebookService from "../services/facebookService";
import nodejieba, { ExtractResult } from 'nodejieba';
import KeywordGroupService from "../services/keywordGroupService";
const keywordGroupService = new KeywordGroupService()

export default class FacebookPostAnalysis extends FacebookService {
    constructor(){
        super()
    }
    async analysis(){
        let fbPostCount = await super.getFacebookPostCount()
        for(let position=0; position<fbPostCount; position++){
            let post = await super.getOneFacebookPost(position)
            let keywords = this.getKeywordsFromText(post.title)
            let categoryIds = await this.getPostCategoryIds(post.title)
            post.keywords = keywords
            post.categoryIds = categoryIds
            await post.save()
        }
    }

    getKeywordsFromText(text: string): string[]{
        const max = 10;
        let results = nodejieba.extract(text, max)
        return results.map(result => result.word)
    }

    async getPostCategoryIds(text: string): Promise<string[]>{
        let categoryIds = []
        const keywordGroupCount = await keywordGroupService.getKeywordGroupCount()
        for(let position=0; position<keywordGroupCount; position++){
            let oneKeywordGroup = await keywordGroupService.getOneKeywordGroup(position)
            if(this.checkTextHaveKeyword(text, oneKeywordGroup.keywords)){
                categoryIds.push(oneKeywordGroup.categoryId)
            }
        }
        return categoryIds
    }

    checkTextHaveKeyword(text:string, keywords: string[]): boolean{
        for (let keyword of keywords){
            if(!text.includes(keyword)){
                return false
            }
        }
        return true
    }
}
