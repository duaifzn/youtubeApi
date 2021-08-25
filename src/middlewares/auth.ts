import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { Config } from "../config/config";
const config = Config[process.env.NODE_ENV]
const jwtSecret = config.jwt.secret
const jwtExpiresIn = config.jwt.expiresIn

export function generateJwtToken(email: string, password: string){
    return jwt.sign(
        { email: email, password: password},
        jwtSecret,
        { expiresIn: jwtExpiresIn }
    )
}

export function authenticateJwtToken(req: Request, res: Response, next: NextFunction){
    const token = req.cookies['authorization']
    if(token == null){
        return res.render('login',{statusCode: 401, status: 'authorization null.'})
    }
    try{
        let decode = jwt.verify(token, jwtSecret)
        next()
    }catch(err){
        return res.render('login', {statusCode: 403, status: 'authorization forbidden.'})
    }  
}