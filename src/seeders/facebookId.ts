import FacebookService from "../services/facebookService";

const facebookService = new FacebookService();
const ids = [
    '100044226139684',
    '46251501064',
    '136845026417486',
    '100044234596005',
    '100044362449362',
    '100044524715843',
    '100044596112172'
];

async function insert(){
    for(let id of ids){
        await facebookService.createFacebookId(id) 
    }
    console.log('insert facebook ids done')
}

setTimeout(insert,5000)
