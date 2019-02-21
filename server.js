'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIES = require('./movies.json');


console.log(process.env.API_TOKEN);

const app = express();

app.use(morgan('dev'));
app.use(cors);
app.use(helmet);

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  console.log(apiToken);
  const authToken = req.get('Authorization');
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

// retrieve movie json here
app.get('/movie', function handleGetMovieData(req, res) {
  let response = MOVIES;

  // query for genre
  if (req.query.genre) {
    response = response.filter(movie =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }

  // query for country
  if (req.query.country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }

  // query for avg_vote
  if (req.query.avg_vote) {
    response = response.filter(movie => Number(movie.avg_vote) >= Number(req.query.avg_vote)
    );
  }

  res.json(response);

});
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Sever listening at http://localhost:${PORT}`);

});
