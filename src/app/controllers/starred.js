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

      render(songs);  

   };

   function hide () {
      $('#starred').hide();
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

         console.log(songs);

         var html = '';

         for (var i in songs) {
           var song = songs[i];
           html += Song().render(song);
         }

         console.log(html);

         $('#starred .songList').html(html);

      }

   };

   return exports

}());