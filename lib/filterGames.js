module.exports = function (games, attr, val) {
  return games.filter(function(game, i) {
    return game[attr].indexOf(val) !== -1;
  });
};
