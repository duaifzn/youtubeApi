import UserService from "../services/userService";
import { generateJwtToken } from '../middlewares/auth'
import { Request, Response } from "express";

export default class UserController extends UserService {
    constructor(){
        super()
    }
    async logIn(req: Request, res: Response){
        const { email, password } = req.body
        if(!await super.checkUser(email, password)){
            return res.render('login',{statusCode: 403, status: 'email password error'})
        }
        const token = generateJwtToken(email, password)
        res.cookie('authorization', token)
        return res.render('index', {statusCode: 200, status: 'login ok'})

    }
    async signUp(req: Request, res: Response){
        const { email, password } = req.body
        await super.createUser(email, password)
        const token = generateJwtToken(email, password)
        res.cookie('authorization', token)
        return res.render('index', {statusCode: 200, status: 'signup ok'})
    }
}