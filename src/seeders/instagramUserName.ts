import { InstagramUserName } from "../models/instagramUserName";

const userNames = [
    'krystalllll_823',
    'tsai_ingwen',
    'power3067830678',
    'doctorkowj',
    'vickybaby61'
];

export default async function instagramUserNameSeed(){
    for(let name of userNames){
        const instagramUserName = await InstagramUserName.findOne({userName: name})
        if(!instagramUserName){
            await InstagramUserName.create({userName: name})
        }
    }
    console.log('insert Instagram User Name done!')
}
