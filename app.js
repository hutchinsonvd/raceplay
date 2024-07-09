import express from 'express'
import cors from 'cors'
import path from'path';
import { getRandomPerson, getHardNationalities, getMediumNationalities, getEasyNationalities, getHelterNationalities } from './postgres.js';

const __dirname = path.resolve(path.dirname('')); 


const app = express();
const port = process.env.PORT || 8080;

const SECRET = process.env.SECRET;
//const SECRET = "SECRET";


app.use(cors())
app.use(express.json()) 

app.use(function (req, res, next) {

  //Here you would check for the user being authenticated

  //Unsure how you're actually checking this, so some psuedo code below
  if (SECRET != req.headers["Authorization"]) {
    res.sendStatus(401);

    console.log("not authed " + SECRET + " vs " + req.headers["Authorization"]);
    console.log(req.headers);

    return;
  }
  else {
    //Carry on with the request chain
    next();
  }
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

//   app.get('/postgres', function(req, res) {
//     res.sendFile(path.join(__dirname, '/postgres.js'));
//   });

app.listen(port);
console.log('Server started at http://localhost:' + port);