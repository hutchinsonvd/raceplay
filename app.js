import express from 'express'
import cors from 'cors'
import path from'path';
import {isSameRegion, getRandomPerson, getHardNationalities, getMediumNationalities, getEasyNationalities, getHelterNationalities } from './postgres.js';


const app = express();
const port = process.env.PORT || 8080;

//const SECRET = process.env.SECRET; //for prod only
const SECRET = "SECRET";


app.use(cors())
app.use(express.json()) 

app.use(function (req, res, next) {

  //Here you would check for the user being authenticated

  //Unsure how you're actually checking this, so some psuedo code below
  if (SECRET != req.headers["authorization"]) {
    res.sendStatus(401);

    console.log("not authed " + SECRET + " vs " + req.headers["authorization"]);
    console.log(req.headers);

    return;
  }
  else {
    //Carry on with the request chain
    next();
  }
});

  app.post('/region', async function (req, res) {
    
    
    await isSameRegion(req.body.candidate, req.body.actual).then(response => res.send(response));
  });

  app.get('/random', async function(req, res) {

    getRandomPerson()
    .then(response => res.send(response));
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