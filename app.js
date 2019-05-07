
import bscrypt from  'bcryptjs';
import faker from 'faker';
import fs from 'fs';
import geoRan from 'geojson-random';

// const vnBBox = {
//     'Vietnam': (102.170435826, 8.59975962975, 109.33526981, 23.3520633001)
// }
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


function locationFactory(){
    let a = geoRan.position();
    return {
        latitude: a[0],
        longitude: a[1]
    }
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

function createCompanyLocation() {
    let records = [];
    let lookup = {};
    let company_keys = JSON.parse(fs.readFileSync('company_lookup.json','utf8'));
    let keys = Object.keys(company_keys);
    let len = keys.length;
    for (let i = 0; i < 50; i++){
        records.push({
            company_id: JSON.stringify(getRandomInt(0, len-1) ? getRandomInt(1, len-1) : 1 ),
            address: faker.address.streetAddress() + ' ' + faker.address.streetName(),
            city: faker.address.city(),
            latitude: faker.address.latitude(),
            longitude: faker.address.longitude(),
            created_at: new Date(),
            updated_at: new Date()
        })
    }
    log(records, 'location.json')
}


async function run(){
    await createCompany();
    createUser();
    createCompanyLocation()
}
run();

// console.log()

