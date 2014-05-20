var starred = (function(){
   
  var viewId = 'starred',
      
      storageKey = 'musicFinder:starred',

      starredSongs = [],

      exports = {
         init: init,
         hide: hide,
         star: star,
         reset: reset,
         getSongs: getSongs
      };

  function init () {

     // Make the view visible
     $('#' + viewId).show();

     // Ensure the controller listens to the UI
     bindEventHandlers();

     // Render starred songs
     render(getSongs());  

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
    
    var song = Song.get(data.id, getSongs());


    star(song);

  };

 
  function star (song) {

  var starredSongs = getSongs();

  console.log(starredSongs);

  for (var i in starredSongs) {
  
    if (starredSongs[i].id && starredSongs[i].id === song.id) {
      console.log('song is already starred');
      starredSongs.splice(i, 1);
      setSongs(starredSongs);
      render(starredSongs);
      return false
    }
  }

  starredSongs.push(song);
  setSongs(starredSongs);
  render(starredSongs);
  return true
  };


  function getSongs () {

    var starredSongs = localStorage.getItem(storageKey);

    if (starredSongs) {
      return JSON.parse(starredSongs);
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