Tuuune.songHistory = (function(){
   
   var  Song = include('Song'),
        SongList = include('SongList'),
        player = include('player'),
       
        songHistory;
   
  function init () {

      $('#songHistory')
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
    $('#songHistory').off().hide();
    $('#player').off();
  };

  function render() {

    songHistory = player.songHistory;

    if (songHistory && songHistory.length) {
      console.log(songHistory);
      $('#songHistory .songList').html(songHistory.render());
    };
  };

  return {
    init: init,
    hide: hide
  }

}());