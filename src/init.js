var Tuuune = {
  views: {},
  players: {}
};

function include (name) {
  return Tuuune[name]
};

$(function() {

   var appPrefix = 'musicfinder',
       nav = include('nav'),
       player = include('player');

  nav.init('discover');

  player.init();
         
});