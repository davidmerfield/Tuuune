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

   function addListener (view, songList, allowedEvents) {

    $('#' + view).on('click', '.song .buttons span', function(e){
      
      var id = $(this).parent().parent().attr('id'),
          className = $(this).attr('class'),
          song = songList.find(id);

      if (!song && className === 'starSong') {
        song = starred.cache.find(id);
      };

      if (!song) {
        console.log('song not found in songlist');
        return false
      };

      if (allowedEvents && allowedEvents.indexOf(className) === -1) {
        e.preventDefault();
        return false
      };

      eventHandlers[className](song, songList, $(this));

      $('#' + view).trigger(className, {id: id});

      e.preventDefault();
      return false
    });

    $('#' + view).on('click', '.song',function(e){
      
      var id = $(this).attr('id'),
          className = $(this).attr('class'),
          song = songList.find(id);

      if (allowedEvents && allowedEvents.indexOf(className) === -1) {
        e.preventDefault();
        return false
      };

      eventHandlers['playSong'](song, songList, $(this));

      $('#' + view).trigger('playSong', {id: id});

      e.preventDefault();
      return false
    });


   };

   function removeListener (view) {
    $('#' + view).off();
   };

   return exports;

}());