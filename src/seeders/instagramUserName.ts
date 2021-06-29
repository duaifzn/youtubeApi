import InstagramService from "../services/instagramService";

const instagramService = new InstagramService();
const userNames = [
    'krystalllll_823',
    'tsai_ingwen',
    'power3067830678',
    'doctorkowj',
    'vickybaby61'
];
async function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () =>{
    await timeout(5000);
    for(let name of userNames){
        let [data, err] = await instagramService.createInstagramUserName(name)
        if(err){
            console.error(err)
        }
    }
    console.log('insert Instagram User Name done')
    process.exit(0)
})()
