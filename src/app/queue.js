Tuuune.queue = (function(){
   
   var  Song = include('Song'),
        SongList = include('SongList'),
        player = include('player');
          
  function init () {

      $('#queue')
        .show()
        .on('click', '.song button', function(e){
          Song.eventHandler(this)
        });

      $(player).on('songChange', function(){
         render();
      });

      render();
   };

  function hide () {
    $('#queue').off().hide();
    $('#player').off();
  };

  function render() {

    songQueue = player.queue();

    if (songQueue && songQueue.user.length) {
      $('#queue .songList').html(songQueue.user.render());
    };
  };

  return {
    init: init,
    hide: hide
  }

}());