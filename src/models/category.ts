import {Schema, Document, model} from 'mongoose';

export interface ICategory extends Document{
    name: string,
}

export const categorySchema = new Schema({
    name:{
        type: String, require: true
    },
},{ timestamps: true, collection: 'category' })

export const Category = model<ICategory>('Category', categorySchema)