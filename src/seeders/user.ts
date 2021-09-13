import { User } from "../models/user";
import bcrypt from "bcrypt";
const users = [
    {
        email: 'duaifzn@gmail.com',
        password: 'aaaaa'
    },
]

export default async function userSeed(){
    const saltRounds = 10
    
    for(const user of users){
        const tempUser = await User.findOne({email: user.email})
        if(!tempUser){
            const hashPassword = await bcrypt.hash(user.password, saltRounds)
            await User.create({email: user.email, password: hashPassword})
        }
    }
    console.log('insert user done!')
}
    

