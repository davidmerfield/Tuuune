var starred = (function(){
   
  var viewId = 'starred',

      starredSongs,
      
      storageKey = 'musicFinder:starred',

      exports = {
         init: init,
         hide: hide,
         star: star,
         unstar: unstar,
         reset: reset,
         savedSongs: savedSongs
      };

  function init () {

    starredSongs = savedSongs();

     // Make the view visible
     $('#' + viewId).show();

     // Ensure the controller listens to the UI
     bindEventHandlers();

     // Render starred songs
     render();  

   };

  function hide () {

    $('#' + viewId).hide();

    unbindEventHandlers();

  };

  function reset() {
     localStorage.removeItem(storageKey);
  };

  function bindEventHandlers () {
    
    Song.addListener(viewId, starredSongs);

  };

  function unbindEventHandlers () {   

    Song.removeListener(viewId);

  };
  
  function isStarred (id) {

    var songs = savedSongs();

    return songs.find(id)
  };

  function star (song) {

    song.isStarred = true;

    var songs = savedSongs();
        songs.unshift(song);

    console.log(songs);

    setSongs(songs);

  };

  function unstar (song) {

    song.isStarred = false;

    var songs = savedSongs();
        songs.remove(song.id);

    setSongs(songs);
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

    starredSongs = savedSongs();
    
    songsHTML = starredSongs.render();

    $('#' + viewId + ' .songList').html(songsHTML);

  };

  return exports

}());