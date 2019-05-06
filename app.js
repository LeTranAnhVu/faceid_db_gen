
import bscrypt from  'bcryptjs';
import faker from 'faker';
import fs from 'fs';
function genkey(){
    let key = JSON.stringify(getRandomInt(2000, 9000));
    return new Promise((resolve)=>{
        bscrypt.hash(key, 10, (e, hash)=>{
            if(e){
                console.log('e', e);
                return null;
            }
            resolve({key,hash});
        })
    })
}

function log(o, filename){
    let str = JSON.stringify(o);
    fs.writeFileSync(filename, str,'utf8');
}



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

async function createCompany() {
    let records = [];
    let lookup = {};
    for (let i = 0; i < 15; i++){
        let {key, hash} = await genkey();
        lookup[key] = hash;
        records.push({
            name: faker.company.companyName(),
            secret_key: hash ,
            created_at: new Date(),
            updated_at: new Date()
        })
    }
    log(lookup, 'company_lookup.json');
    log(records, 'company.json');
}
async function createUser() {
    let records = [];
    let lookup = {};
    let company_keys = JSON.parse(fs.readFileSync('company_lookup.json','utf8'));
    let keys = Object.keys(company_keys);
    let len = keys.length;
    for (let i = 0; i < 50; i++){
        records.push({
            fullname: faker.name.firstName() + ' ' + faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            avatar: 'avatar.png',
            company_id: JSON.stringify(getRandomInt(0, len-1) ? getRandomInt(1, len-1) : 1 ),
            created_at: new Date(),
            updated_at: new Date()
        })
    }
    log(records, 'user.json')
}


async function run(){
    await createCompany();
    createUser();
}
run();
