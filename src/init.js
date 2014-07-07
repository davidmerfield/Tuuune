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

  // Show the first view
  nav.init('discover');

  // Load any songs which the user queued previously
  // queue.user.add(storage.get(storageKey));

  // Start the player
  player.init();
         
});