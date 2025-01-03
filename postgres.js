import pg from 'pg'
import 'dotenv/config'
import { decryptPerson } from './crypt.js'

const { Client } = pg

const useSSL = process.env.SSL || true;

const client = new Client({
    connectionString: process.env.PGCONNECTIONSTRING,
    ssl:useSSL == 'false' ? false : true})

    try {
        await client.connect()
    } catch (error) {
        console.error(error);
    }

export async function isHighScore(score, gameMode, difficulty) {

    return getHighScores(gameMode, difficulty)
    .then(rows => {
        
        if (null == rows || 0 == rows.length) {
            console.error("Error checking if score was a highscore: " + gameMode + " " + difficulty)

            return false;
        }

        return rows[rows.length-1].score < score
    });
}

export async function addHighScoreAndDeleteOldScore(score, gameMode, difficulty, name) {

    if (15 <= name.length) {

        console.error("Name for high score board too long");
        Promise.resolve(false);
    }

    return getHighScores(gameMode, difficulty)
    .then(rows => {
        if (null == rows || 0 == rows.length) {
            console.error("Error adding score to high scores: " + gameMode + " " + difficulty + " for rows: " + rows)

            return false;
        }
       
        var lowestScore = rows[rows.length-1];
        var numResults = rows.length

        if (lowestScore.score > score && numResults >= 5) {
            console.error("Entered high score does not qualify: " + score + " vs high score on record: " + lowestScore.score)

            return false;
        }

        if (numResults >= 5) {
            var idToDelete =lowestScore.id
            deleteHighScore(idToDelete);
        }

        return addHighScore(score, gameMode, difficulty, name);    
    });
}

export async function getHighScores(gameMode, difficulty) {
    const baseQuery = "Select * from highscores WHERE game_mode = $1 AND difficulty = $2";

    return await client.query(baseQuery, [gameMode, difficulty])
    .then(result => {
        if (null == result || null == result.rows || 0 == result.rows.length) {
            console.error("Error getting high scores: " + gameMode + " " + difficulty)

            return [];
        }

        var sortedRows = result.rows.sort((a, b) => b.score - a.score)
        if (result.rows.length > 5) {
            //sort and delete lower scores

            console.log("here")
            
            for (var i = 5; i < sortedRows.length; i++) {
                var idToDelete =sortedRows[i].id
                deleteHighScore(idToDelete);
            }

            return sortedRows.slice(0, 5);
        }

        return sortedRows
    });
}

export async function isSameRegion(candidateNation, actualNation) {

    const baseQuery = "SELECT region FROM nationalities WHERE nationality = $1 OR nationality = $2"

    return await client.query(baseQuery, [candidateNation, actualNation])
    .then(result => {
        if (null == result || null == result.rows || 0 == result.rows.length) {
            console.error("Error checking if regions were same: " + actualNation + " vs " + candidateNation)

            return false;
        }

        console.debug(result.rows[0].region)
        console.debug(result.rows[1].region)

        return result.rows[0].region == result.rows[1].region
    })
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

    var nat = decryptPerson(JSON.parse(person)).nationality;
    
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

            var randomNat = nats.at(randomIndices.at(i));

            if (nat == randomNat) {
                randomNat = nats.at(Math.floor(Math.random() * (nats.length-1)));
            }
            
            results.push(randomNat);
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

    var numToReturn = Math.pow(2, score / 5);

    if (numToReturn > 9) {
        numToReturn = 9;
    }
    console.debug(score);
    console.debug(numToReturn);

    return getNNationalities(person, numToReturn);
}


async function addHighScore(score, gameMode, difficulty, name) {

    const baseQuery = "INSERT into highscores (id, player_name, game_mode, difficulty, score) VALUES (DEFAULT, $1, $2, $3, $4)"
    return await client.query(baseQuery, [name, gameMode, difficulty, score]);
}

async function deleteHighScore(id) {

    const baseQuery = "Delete from highscores where id = $1";

    return await client.query(baseQuery, [id]);
}

function getLowestScore(resultRows) {

    var arr = resultRows.slice();

    while(arr.length != 1) {
        if (arr[0].score <= arr[1].score) {
            arr.splice(1,1);
        }
        else {
            arr.splice(0, 1);
        }
    }

    return arr[0];
}