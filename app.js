import express from 'express'
import cors from 'cors'
import path from'path';
import { getRandomPerson, getAllNationalities } from './postgres.js';

const __dirname = path.resolve(path.dirname('')); 


const app = express();
const port = process.env.PORT || 8080;


app.use(cors())

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/front-end/index.html'));
  });

  app.get('/random', async function(req, res) {
    getRandomPerson()
    .then(response => res.send(response));
  });

  app.get('/nationalities', async function(req, res) {
    await getAllNationalities()
    .then(response => res.send(response));
  });

//   app.get('/postgres', function(req, res) {
//     res.sendFile(path.join(__dirname, '/postgres.js'));
//   });

app.listen(port);
console.log('Server started at http://localhost:' + port);