Tuuune.songHistory = (function(){

  var Song = include('Song'),
      SongList = include('SongList'),

      storage = include('storage'),
      storageKey = 'history',

      player = include('player'),

      songs = new SongList;

  function init () {

    songs.add(storage.get(storageKey));

  };

  function show () {

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
    storage.set(storageKey, songs)
  };

  function add (song) {
    songs.unshift(song);
    storage.set(storageKey, songs)
  };

  function render() {
    $('#songHistory .songList').html(songs.render());
  };

  return {
    init: init,
    show: show,
    hide: hide,
    add: add,
    songs: songs
  }

}());