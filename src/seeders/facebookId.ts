import { FacebookId } from "../models/facebookId"

const ids = [
    '479745092117306',
    '862974273769320',
    '111629753518122',
    '179409175435468',
    '2227282380826193',
    '808048545969356',
    '203598423025335',
    // '100044226139684',
    // '46251501064',
    // '136845026417486',
    // '100044234596005',
    // '100044362449362',
    // '100044524715843',
    // '100044596112172'
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
