import pg from 'pg'
import 'dotenv/config'


const { Client } = pg

const client = new Client({
    connectionString: process.env.PGCONNECTIONSTRING,
ssl:false})
//ssl:true})

    try {
        await client.connect()
    } catch (error) {
        console.log(error);
    }

export async function getRandomPerson() {
    
    return await client.query("SELECT * FROM people OFFSET floor(random() * 311503) LIMIT 1;")
    .then(result => result.rows[0])
}

export async function getAllNationalities() {

    return await client.query("SELECT * FROM nationalities")
    .then(result => result.rows.map(row => row.nationality))
}

export async function getHardNationalities(person) {
    return getNNationalities(person, 29);
}

async function getNNationalities(person, numResults) {

    var nat = JSON.parse(person).nationality;
    
    return await getAllNationalities()
    .then(nats => {
        var randomIndices = [];

        for (var i = 0; i < numResults; i++) {
            var rand = Math.floor(Math.random() * (nats.length-1));
    
            randomIndices.push(rand);
        }

        var solutionIndex = Math.floor(Math.random() * (numResults));
        if (numResults == 1) {

            var results = [];
            var a = Math.floor(Math.random() * 10);

            if (a <= 5) {
                results.push(nats.at(randomIndices.at(0)));
                results.push(nat);
            }
            else {

                results.push(nat);
                results.push(nats.at(randomIndices.at(0)));        
            }

            return results;
        }

        var results = [];
        
        for (var i = 0; i < numResults; i++) {

            if (solutionIndex == i) {
                results.push(nat);
            }

            results.push(nats.at(randomIndices.at(i)));
        }

        return results;
    })
}

export async function getMediumNationalities(person) {

    return getNNationalities(person, 9);
}

export async function getEasyNationalities(person) {

    return getNNationalities(person, 4);
}

export async function getHelterNationalities(person, score) {

    var numToReturn = Math.pow(2, score);

    if (numToReturn > 9) {
        numToReturn = 9;
    }
    console.log(score);
    console.log(numToReturn);

    return getNNationalities(person, numToReturn);
}
