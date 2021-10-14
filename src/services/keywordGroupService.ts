import { KeywordGroup } from "../models/keywordGroup";
import { Category } from "../models/category";


export default class KeywordGroupService {
    async findOneOrAddOneCategory(name: string): Promise<string>{
        let category = await Category.findOne({name: name})
        if(!category){
            let created = await Category.create({name: name})
            return created.id
        }
        return category.id
    }
    
    async addOneKeywordGroup(keywords: string[], categoryId: string){
        let keywordGroup = await KeywordGroup.findOne({keywords: keywords, categoryId: categoryId})
        if(!keywordGroup){
            await KeywordGroup.create({keywords: keywords, categoryId: categoryId})
        }
    }

    async getKeywordGroupCount(): Promise<number>{
        return await KeywordGroup.countDocuments({})
    }

    async getOneKeywordGroup(position: number){
        let keywordGroup = await KeywordGroup.find({}).sort({_id: -1}).skip(position).limit(1)
        return keywordGroup[0]
    }
}