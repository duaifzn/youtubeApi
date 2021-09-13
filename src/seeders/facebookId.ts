import { FacebookId } from "../models/facebookId"

const ids = [
    '100044226139684',
    '46251501064',
    '136845026417486',
    '100044234596005',
    '100044362449362',
    '100044524715843',
    '100044596112172'
];

export default async function facebookIdSeed(){
    for(let id of ids){
        const facebookId = await FacebookId.findOne({id: id})
        if(!facebookId){
            await FacebookId.create({id: id})
        }
    }
    console.log('insert facebook ids done!')
}
