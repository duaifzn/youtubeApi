import { User } from '../models/user'
import bcrypt from 'bcrypt'

export default class UserService {

    async createUser(email: string, password: string){
        const saltRounds = 10
        const hashPassword = await bcrypt.hash(password, saltRounds)
        await User.create({
            email: email,
            password: hashPassword
        })
    }

    async checkUser(email: string, password: string): Promise<Boolean>{
        const user = await User.findOne({email: email})
        if(!user){
            return false
        }
        if(!await bcrypt.compare(password, user.password)){
            return false
        }
        return true
    }
}