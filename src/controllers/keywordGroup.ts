import KeywordGroupService from "../services/keywordGroupService";

export default class KeywordGroup extends KeywordGroupService {
    constructor(){
        super()
    }
    async addOneCategoryKeywordGroup(categoryName: string, keywords: string[]){
        let categoryId = await super.findOneOrAddOneCategory(categoryName)
        await super.addOneKeywordGroup(keywords, categoryId)
    }
}