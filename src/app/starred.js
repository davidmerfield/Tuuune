Tuuune.starred = (function(){

  var Song = include('Song'),
      SongList = include('SongList'),
      storage = include('storage'),

      storageKey = 'starred',
    
      starredSongs = new SongList;

  function init () {
    
    starredSongs.add(storage.get(storageKey));

    $('#starred').show();

    Song.addListener('#starred', starredSongs);

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
    return starredSongs.find(id)
  };

  function toggle (song) {

    console.log('Toggling' + song.pretty.title);

    // this should be instantiated
    starredSongs.add(storage.get(storageKey));

    song.isStarred = !song.isStarred;

    if (song.isStarred) {
      starredSongs.unshift(song);
    } else {
      starredSongs.remove(song.id);
    };

    $('[data-id="' +  song.id + '"] .star').attr('data-isStarred', song.isStarred);
    storage.set(storageKey, starredSongs); 

    render();
  };

  function render() {
    songsHTML = starredSongs.render();
    $('#starred .songList').html(songsHTML);
  };

  return {
    init: init,
    hide: hide,
    toggle: toggle
  }

}());