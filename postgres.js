import pg from 'pg'
import 'dotenv/config'


const { Client } = pg

const client = new Client({
    connectionString: process.env.PGCONNECTIONSTRING,
ssl:true})

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

export async function getRandomNationalities() {
    return await client.query("SELECT * FROM nationalities OFFSET floor(random() * 405) LIMIT 30;")
    .then(result => result.rows.map(row => row.nationality))
}
