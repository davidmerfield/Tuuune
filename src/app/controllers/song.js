var Song = (function(){

   var exports = {
      init: init,
      render: render,
      get: get,
      getSongsAfter: getSongsAfter,
      add: add,
      drop: drop

   };

   var template = 
      '<a class="song" href="#" id="{{id}}">' +
         '<span class="thumbnail" style="background: url({{thumbnail}}) no-repeat center center;background-size: cover"><img src="" /></span>' +
         '<span class="title">{{pretty.title}} </span> ' +
         '<span class="buttons">' +
           '<span class="playSong">Play</span>' +
           '<span class="removeSong">Hide</span>' +
           '<span class="starSong">Star</span>' +
           '<span class="queueSong">+ Queue</span>' +
         '</span>' + 
         '<span class="stats">' +
           '<span class="duration">{{pretty.duration}} &#8226; </span>' +
           '<span class="views">{{pretty.listens}} listens &#8226; </span>' +
           '<span class="source">{{source}}</span>' +
         '</span>' +
      '</a>';

   function init () {

      $('body').on('click', '.playSong', function(e){
         $(exports).trigger('playSong', [{id:$(this).parent().parent().attr('id')}]);
         return false;
      });

       $('body').on('click', '.queueSong', function(e){
          e.preventDefault(); // stops click event bubbling to .result
          $(exports).trigger('queueSong', [{id:$(this).parent().parent().attr('id')}]);
       });

       $('body').on('click', '.starSong', function(e){
          e.preventDefault(); // stops click event bubbling to .result
          $(exports).trigger('starSong', [{id:$(this).parent().parent().attr('id')}]);
       });

       $('body').on('click', '.removeSong', function(e){
          e.preventDefault(); // stops click event bubbling to .result
          $(exports).trigger('removeSong', [{id:$(this).parent().parent().attr('id')}]);
          $(this).parent().parent().remove();
       });
   };

   function render(song) {
      return Mustache.render(template, song);
   };

   function get (id, songlist) {

     for (var i in songlist) {
       
       if (songlist[i].id && songlist[i].id === id) {
         return songlist[i]
       };
     };
   };

   function getSongsAfter(song, songlist) {

     for (var i in songlist) {
       
       if (songlist[i].id && songlist[i].id === song.id) {
         return songlist.slice(i + 1)
       };
     };
   };

   function drop (id, songlist) {
     
     for (var i in songlist) {

       if (songlist[i].id && songlist[i].id === id) {
         songlist.splice(i, 1);
       };
       
     };
   };  

   function add (newSongs, songlist) {
     
     if (newSongs.length === 0) {return songlist};

     var newSong = newSongs.pop();

     for (var i in songlist) {
       if (newSong.id === songlist[i].id) {
         
         // ignore this item we have it already
         return add(newSongs, songlist);
       };
     };

     // item is unique, add it to old items
     songlist.push(newSong);

     return add(newSongs, songlist);
   };

   return exports;

}());