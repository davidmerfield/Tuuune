var Tuuune = {
  views: {},
  players: {},
  search: []
};

function include (name) {
  return Tuuune[name]
}

$(function() {

  var nav = include('nav'),
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
  $(document).on('scroll', function(e){
    
    var offset = $(document).scrollTop();

    if (offset > 168) {
      $('header').attr('class', 'small')
      $('.sidebar').addClass('fixed')
    } else {
      $('header').attr('class', '')
      $('.sidebar').removeClass('fixed')
    }
  });
});