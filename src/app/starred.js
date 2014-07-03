Tuuune.starred = (function(){

  var Song = include('Song'),
      SongList = include('SongList'),

      storageKey = 'musicFinder:starred',
    
      starredSongs = new SongList;

  function init () {

    starredSongs.add(savedSongs());

    $('#starred')
      .show()
      .on('click', '.song button', function(e){
        Song.eventHandler(this, starredSongs)
      });

    // Render starred songs
    render();  

  };

  function hide () {

    $('#starred')
      .off()
      .hide()
  };

  function reset() {
    localStorage.removeItem(storageKey);
  };

  function isStarred (id) {
    return starredSongs.find(id)
  };

  function toggle (song) {

    console.log('Toggling' + song.pretty.title);

    // this should be instantiated
    starredSongs.add(savedSongs());

    song.isStarred = !song.isStarred;

    if (song.isStarred) {
      starredSongs.unshift(song);
    } else {
      starredSongs.remove(song.id);
      render();
    };

    $('#' + song.id + ' .star').attr('data-isStarred', song.isStarred);

    setSongs(starredSongs);    
  };

  function savedSongs () {

    var songs = localStorage.getItem(storageKey);

    if (songs) {
      return new SongList(JSON.parse(songs));
    } else {
      return new SongList([])
    };
  };

  function setSongs (songs) {
    return localStorage.setItem(storageKey, JSON.stringify(songs));
  };

  function render() {
    songsHTML = starredSongs.render();
    $('#starred .songList').html(songsHTML);
  };

  return {
    init: init,
    hide: hide,
    toggle: toggle,
    savedSongs: savedSongs
  }

}());