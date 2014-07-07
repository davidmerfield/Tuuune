Tuuune.songHistory = (function(){
   
   var  Song = include('Song'),
        SongList = include('SongList'),
        storage = include('storage'),
        player = include('player'),
       
        storageKey = 'history',
        songHistory = new SongList;
   
  function init () {

    songHistory.add(storage.get(storageKey));

    $('#songHistory')
      .show()
      .on('click', '.song', Song.listener);

    $(player).on('songChange', function(){
       render();
    });

    render();
   };

  function hide () {
    $('#songHistory').off().hide();
    $('#player').off();
    storage.set(storageKey, songHistory)
  };

  function add (song) {
    songHistory.unshift(song);
    storage.set(storageKey, songHistory)
  };

  function render() {
    $('#songHistory .songList').html(songHistory.render());
  };

  return {
    init: init,
    hide: hide,
    add: add
  }

}());