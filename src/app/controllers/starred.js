var starred = (function(){
   
  var viewId = 'starred',
      
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

  };

  function unbindEventHandlers () {   

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

    var songs = new SongList(savedSongs());

        songsHTML = songs.render();

    $('#' + viewId + ' .songList').html(songsHTML);

  };

  return exports

}());