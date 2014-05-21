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
        '<span class="thumbnail" style="background: url({{thumbnail}}) no-repeat center center;background-size: cover"><img src="" /></span>' +
         '<span class="title">{{pretty.title}} </span> ' +
         '<span class="buttons">' +
           '<span class="playSong">Play</span>' +
           '<span class="removeSong">Hide</span>' +
           '<span class="starSong {{#isStarred}} starred {{/isStarred}}">&#9733;</span>' +
           '<span class="queueSong">+ Queue</span>' +
         '</span>' + 
         '<span class="stats">' +
           '<span class="duration">{{pretty.duration}} &#8226; </span>' +
           '<span class="views">{{pretty.listens}} listens &#8226; </span>' +
           '<span class="source">{{source.name}}</span>' +
         '</span>';

   function init () {

      $('body').on('click', '.song .buttons span', function(e){
         
         var className = $(this).attr('class'),
             id = $(this).parent().parent().attr('id');

        if (className === 'starSong') {
          $(this).toggleClass('starred');
        };

        if (className === 'removeSong') {
          $(this).parent().parent().remove();
        };
        
        e.preventDefault(); // stops click event bubbling to .result
 
        $(exports).trigger(className, [{id: id}]);

         return false; // stops window scrolling to top
 
      });

   };

   function render(song) {

      var songNode = document.createElement('a');
          songNode.className = 'song';
          songNode.id = song.id;
          songNode.innerHTML = Mustache.render(template, song);

      return songNode;
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