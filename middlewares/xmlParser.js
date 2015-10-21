var fs = require('fs'),
    xml2js = require('xml2js');

var formatPlayers = function(players) {
  return players.Player.map(function(player){
    var p = {};
    Object.keys(apiPlayerMapping).forEach(function(key) {
      p[key] = apiPlayerMapping[key].length > 1 ? apiPlayerMapping[key][1](player[apiPlayerMapping[key][0]][0]) : player[apiPlayerMapping[key][0]][0];
    });
    return p;
  });
};

var formatGames = function (games) {
  return games.map(function(game) {
    var g = {};
    Object.keys(apiGameMapping).forEach(function(key) {
      g[key] = apiGameMapping[key].length > 1 ? apiGameMapping[key][1](game.Game[0][apiGameMapping[key][0]][0]) : game.Game[0][apiGameMapping[key][0]][0];
    });
    return g;
  });
};

var apiGameMapping = {
  id : ['ExternalGameID'],
  name: ['GameName'],
  start: ['GameStartDate'],
  players: ['Players', formatPlayers]
};

var apiPlayerMapping = {
  firstName: ['FirstName'],
  lastName: ['LastName'],
  playerName: ['PlayerName'],
  rank: ['Rank', parseInt]
};

module.exports = function(req, res, next) {
  var parser = new xml2js.Parser();
  fs.readFile(process.env.EXPORT_FOLDER + '/tournament.xml', function(err, data) {
    parser.parseString(data, function(err, res) {
      req.tournament = res.pXML;
      req.games = formatGames(res.pXML.Games);
      next();
    });
  });
};
