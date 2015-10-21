var express = require('express'),
    app = express(),
    fs = require('fs'),
    xml2js = require('xml2js');

var apiGameMapping = {
  id : 'ExternalGameID',
  name: 'GameName',
  start: 'GameStartDate',
  players: 'Players'
};

var xmlParserMiddleware = function(req, res, next) {
  var parser = new xml2js.Parser({
    attrNameProcessors: [
      function (Game) {
        return Game;
      }
    ]
  });
  fs.readFile(process.env.EXPORT_FOLDER + '/tournament.xml', function(err, data) {
    parser.parseString(data, function(err, res) {
      req.tournament = res.pXML;
      req.games = formatGames(res.pXML.Games);
      next();
    });
  });
};

var formatGames = function (games) {
  return games.map(function(game) {
    m = {};
    Object.keys(apiGameMapping).forEach(function(key) {
      m[key] = game.Game[0][apiGameMapping[key]][0];
    });
    return m;
  });
};

var filterGames = function (games, attr, val) {
  return games.filter(function(game, i) {
    return game[attr].indexOf(val) !== -1;
  });
};

app.get('/ping', function(req, res, next) {
  res.status(200).send('pong');
});

app.get('/tournament', xmlParserMiddleware, function(req, res, next) {
  res.json(req.tournament);
});

app.get('/games/:id', xmlParserMiddleware, function(req, res, next) {
  var games = filterGames(req.games, 'id', req.params.id);
  if(games) {
    res.json(games[0]);
  } else {
    res.status(404).send('Game does not exist');
  }
});

app.get('/games/:id/players', xmlParserMiddleware, function(req, res, next) {
  var games = filterGames(req.games, 'id', req.params.id);
  if(games) {
    res.json(games[0].players);
  } else {
    res.status(404).send('Game does not exist');
  }
});

app.get('/games', xmlParserMiddleware, function(req, res, next) {
  res.json(req.games);
});

app.listen(process.env.PORT);

