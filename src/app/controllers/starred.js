var starred = (function(){
   
   var storageKey = 'musicFinder:starred';

   var exports = {
         init: init,
         hide: hide,
         star: star,
         unstar: unstar,
         reset: reset,
         getSongs: getSongs
       };
   
   function init () {

      $('#starred').show();

      var songs = getSongs();
      
      addUIListeners();
      
      render(songs);  

   };

   function hide () {
      $('#starred').hide();
      $(Song).off();
   };


  function addUIListeners () {
    
    $(Song).on('playSong', function(e, data){
      
      console.log('PLAYER SONG CALLED');

      var id = data.id,
          songs = getSongs(),
          song = songs[id],
          defaultQueue = songs; // NO

      player.play(song, defaultQueue);
       
    });

    $(Song).on('queueSong', function(e, data){

      var id = data.id,
          songs = getSongs(),
          song = songs[id];

      player.addToQueue('user', song);
       
    });

    $(Song).on('starSong', function(e, data){

      var id = data.id;
          songInfo = lookupSong(id);
          song = songInfo.song;

       starred.star(song);

    });

   };

   function reset() {
      localStorage.removeItem(storageKey);
   };

   function getSongs () {
      
      var songs = localStorage.getItem(storageKey);

      if (songs) {
         return JSON.parse(songs);
      } else {
         setSongs({});
         return {}
      };

   };

   function setSongs (songs) {
      return localStorage.setItem(storageKey, JSON.stringify(songs));
   };

   function star (song) {
      
      var songs = getSongs();
          songs[song.id] = song;

         setSongs(songs);

   };

   function unstar (song) {

      var songs = getSongs();

          delete songs[song.id];

          setSongs(songs);


   };

   function render(songs) {

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