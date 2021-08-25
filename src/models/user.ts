import { Schema, Document, model } from "mongoose";

export interface IUser extends Document{
    email: string
    password: string
    role?: string
}

export const userSchema = new Schema({
    email:{
        type: String, require: true
    },
    password:{
        type: String, require: true
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

export const User = model<IUser>('User', userSchema)