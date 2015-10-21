var express = require('express'),
    app = express(),
    filterGames = require('./lib/filterGames'),
    middlewares = require('./middlewares');

app.get('/ping', function(req, res, next) {
  res.status(200).send('pong');
});

app.get('/tournament', middlewares.xmlParser, function(req, res, next) {
  res.json(req.tournament);
});

app.get('/games/:id', middlewares.xmlParser, function(req, res, next) {
  var games = filterGames(req.games, 'id', req.params.id);
  if(games.length) {
    res.json(games[0]);
  } else {
    next();
  }
});

app.get('/games/:id/players', middlewares.xmlParser, function(req, res, next) {
  var games = filterGames(req.games, 'id', req.params.id);
  if(games.length) {
    res.json(games[0].players);
  } else {
    next();
  }
});

app.get('/games', middlewares.xmlParser, function(req, res, next) {
  res.json(req.games);
});

app.use(function (req, res, next) {
  res.status(404).send('Data not available');
});

app.listen(process.env.PORT);
