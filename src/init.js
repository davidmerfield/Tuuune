var Tuuune = {
  views: {},
  players: {}
};

function include (name) {
  return Tuuune[name]
}

$(function() {

  var appPrefix = 'musicfinder',
      nav = include('nav'),
      player = include('player'),
      starred = include('starred');
      songHistory = include('songHistory'),
      discover = include('discover'),
      queue = include('queue');

  starred.init();
  songHistory.init();
  player.init();
  queue.init();
  discover.init();

  // Show the first view
  nav.init('discover');
       
});