var starred = (function(){
   
  var viewId = 'starred',
      
      storageKey = 'musicFinder:starred',

      starredSongs = [],

      exports = {
         init: init,
         hide: hide,
         star: star,
         unstar: unstar,
         reset: reset,
         getSongs: getSongs
      };

  function init () {

     // Make the view visible
     $('#' + viewId).show();

     // Ensure the controller listens to the UI
     bindEventHandlers();

     starredSongs = getSongs();

     // Render starred songs
     render(starredSongs);  

   };

  function hide () {

    $('#' + viewId).hide();

    unbindEventHandlers();

  };

  function reset() {
     localStorage.removeItem(storageKey);
  };

  function bindEventHandlers () {
    $(Song).on('playSong', playSong);
    $(Song).on('queueSong', queueSong);
    $(Song).on('starSong', starSong);
  };

  function unbindEventHandlers () {   
    $(Song).off();
  };

  function playSong (e, data) {

    var song = Song.get(data.id, getSongs()),
        defaultQueue = Song.getSongsAfter(song, getSongs());

    player.play(song, defaultQueue);

  }; 

  function queueSong (e, data) {
    
    var song = Song.get(data.id, getSongs());

    player.addToQueue('user', song);

  };

  function starSong (e, data) {

    var song = Song.get(data.id, starredSongs);
    
    if (song.isStarred) {
      unstar(song);
    } else {
      star(song);

    };

  };

 
  function star (song) {
    
    song.isStarred = true;

    var songs = getSongs();

    for (var i in songs) {
      if (songs[i].id && songs[i].id === song.id) {
        return 
      }
    };

    songs.push(song);
    setSongs(songs);
    render(songs);

  };

  function unstar (song) {

    song.isStarred = false;

    var songs = getSongs();

    for (var i in songs) {
    
      if (songs[i].id && songs[i].id === song.id) {

        songs.splice(i, 1);
        setSongs(songs);

      }
    };

    render(songs);


  };

  function getSongs () {

    var songs = localStorage.getItem(storageKey);

    if (songs) {
      return JSON.parse(songs);
    } else {
      setSongs([]);
      return []
    };

  };

  function setSongs (songs) {
    return localStorage.setItem(storageKey, JSON.stringify(songs));
  };


   function render(songs) {

    console.log(songs);

      if (songs) {

         var html = '';

         for (var i in songs) {
           var song = songs[i];
           html += Song.render(song);
         }

         $('#starred .songList').html(html);

      }

   };

   return exports

}());