Tuuune.starred = (function(){

  var Song = include('Song'),
      SongList = include('SongList'),
    
      storage = include('storage'),
      storageKey = 'starred',
    
      songs = new SongList;

  function init () {    
    songs.add(storage.get(storageKey));
  };

  function show () {
    $('#starred')
      .show()
      .on('click', '.song', songs, Song.listener);

    // Render starred songs
    render();  
  };

  function hide () {

    $('#starred')
      .off()
      .hide()
  };

  function reset() {
    storage.drop(storageKey);
  };

  function isStarred (id) {
    return songs.find(id)
  };

  function toggle (song) {

    // this should be instantiated
    songs.add(storage.get(storageKey));

    song.isStarred = !song.isStarred;

    if (song.isStarred) {
      songs.unshift(song);
    } else {
      songs.remove(song.id);
    };

    $('[data-id="' +  song.id + '"] .star').attr('data-isStarred', song.isStarred);
    storage.set(storageKey, songs); 

    render();
  };

  function render() {
    songsHTML = songs.render();
    $('#starred .songList').html(songsHTML);
  };

  return {
    init: init,
    show: show,
    hide: hide,
    toggle: toggle,
    songs: songs
  }

}());