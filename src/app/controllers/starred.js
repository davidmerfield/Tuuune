var starred = (function(){
   
  var viewId = 'starred',

      starredSongs = savedSongs(),
      
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
    return starredSongs.find(id)
  };

  function star (song) {

    song.isStarred = true;

    starredSongs.unshift(song);

    setSongs(starredSongs);
  };

  function unstar (song) {

    song.isStarred = false;

    starredSongs.remove(song.id);

    setSongs(starredSongs);
  };

  function savedSongs () {

    var songs = localStorage.getItem(storageKey);

    console.log('getting songs');
    console.log(songs);

    if (songs) {
      return new SongList(JSON.parse(songs));
    } else {
      return new SongList([])
    };

  };

  function setSongs (songs) {
    console.log('setting songs');
    console.log(songs);
    return localStorage.setItem(storageKey, JSON.stringify(songs));
  };

  function render() {

    songsHTML = starredSongs.render();

    $('#' + viewId + ' .songList').html(songsHTML);

  };

  return exports

}());