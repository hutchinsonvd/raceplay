import express from 'express'
import cors from 'cors'
import path from'path';
import {addHighScoreAndDeleteOldScore, getHighScores, isHighScore, isSameRegion, getRandomPerson, getHardNationalities, getMediumNationalities, getEasyNationalities, getHelterNationalities } from './postgres.js';
import {encryptData, decryptHeaders} from './crypt.js'

const app = express();
const port = process.env.PORT || 8080;

const SECRET = process.env.SECRET || "SECRET";


app.use(cors())
app.use(express.json()) 

app.use(function (req, res, next) {

  //Here you would check for the user being authenticated

  //Unsure how you're actually checking this, so some psuedo code below
  console.log(req.headers["authorization"])
  console.log(decryptHeaders(req.headers["authorization"]))
  if (SECRET != decryptHeaders(req.headers["authorization"])) {
    res.sendStatus(401);

    return;
  }
  else {
    //Carry on with the request chain
    next();
  }
});

app.post('/get/highscore', async function (req, res) {

  var difficulty = req.body.difficulty;
  var gameMode = req.body.gameMode;
  if ("helterSkelter" == gameMode || "hard" == difficulty) {
      difficulty = "high"
  }
    
  await getHighScores(gameMode, difficulty).then(response => res.send(response));
});

app.post('/is/highscore', async function (req, res) {

  var difficulty = req.body.difficulty;
  var gameMode = req.body.gameMode;
  if ("helterSkelter" == gameMode) {
      difficulty = "high"
  }
    
  await isHighScore(req.body.score, gameMode, difficulty).then(response => res.send(response));
});

app.post('/highscore', async function (req, res) {

  var difficulty = req.body.difficulty;
  var gameMode = req.body.gameMode;
  if ("helterSkelter" == gameMode) {
      difficulty = "high"
  }
    
  await addHighScoreAndDeleteOldScore(req.body.score, gameMode, difficulty, req.body.name)
  .then(response => res.send(response));
});

  app.post('/region', async function (req, res) {
    
    await isSameRegion(req.body.candidate, req.body.actual).then(response => res.send(response));
  });

  app.get('/random', async function(req, res) {

    getRandomPerson()
    .then(response => res.send(encryptData(response)));
  });

  app.post('/nationalities/hard', async function(req, res) {
  
    await getHardNationalities(req.body.data)
    .then(response => res.send(response));
  });

  app.post('/nationalities/medium', async function(req, res) {

    await getMediumNationalities(req.body.data)
    .then(response => res.send(response));
  });

  app.post('/nationalities/easy', async function(req, res) {
    
    await getEasyNationalities(req.body.data)
    .then(response => res.send(response));
  });

  app.post('/nationalities/helterSkelter', async function(req, res) {

    await getHelterNationalities(req.body.data)
    .then(response => res.send(response));
  });

  app.post('/helterSkelter', async function(req, res) {

    console.log(req.body)
    await getHelterNationalities(req.body.data, req.body.score)
    .then(response => res.send(response));
  });


try {
  app.listen(port);
} catch (error) {

  console.log("error listening to port")
  throw Error(error)
}

console.log('Server started at http://localhost:' + port);