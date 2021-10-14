import {Schema, Document, model} from 'mongoose';

export interface IKeywordGroup extends Document{
    keywords: string[],
    categoryId: string,
}

export const keywordGroupSchema = new Schema({
    keywords:{
        type: [String], require: true
    },
    categoryId:{
        type: String, require: true
    },
},{ timestamps: true, collection: 'keywordGroup' })

export const KeywordGroup = model<IKeywordGroup>('keywordGroup', keywordGroupSchema)