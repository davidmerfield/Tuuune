var Song = (function(){

   var exports = {
      init: init,
      addListener: addListener,
      removeListener: removeListener
   };

   function init () {


   };

   var eventHandlers = {
     playSong: function(song, songList) {
        
        player.play(song, songList);

     },
     queueSong: function(song, songList) {
        
        player.addToQueue(song);

     },
     removeSong: function(song, songList, el) {

      songList.remove(song.id);
      el.parent().parent().remove();

     },
     starSong: function(song, songList, el) {

      var isStarred = el.attr('data-isStarred');

      if (isStarred === 'starred') {
        
        starred.unstar(song);
        
        el.attr('data-isStarred', '');

      } else {

        starred.star(song);
        
        el.attr('data-isStarred', 'starred')
      };

     }
   };

   function addListener (view, songList) {

    $('#' + view).on('click', '.song .buttons span', function(e){
      
      var id = $(this).parent().parent().attr('id'),
          className = $(this).attr('class'),
          song = songList.find(id);

      eventHandlers[className](song, songList, $(this));

      $('#' + view).trigger(className, {id: id});

    });

   };

   function removeListener (view) {
    $('#' + view).off();
   };

   return exports;

}());