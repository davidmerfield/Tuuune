var Song = (function(){

   var exports = {
      init: init,
      addListener: addListener,
      removeListener: removeListener
   };

   function init () {


   };

   var eventHandlers = {
     play: function(song, songList) {
        
        player.play(song, songList);

     },
     addToQueue: function(song, songList) {
        
        player.addToQueue(song);

     },
     remove: function(song, songList, el) {

      songList.remove(song.id);
      el.parent().parent().remove();

     },
     star: function(song, songList, el) {

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

   function addListener (view, songList, options) {

    var options = options || {};

    $('#' + view).on('click', '.song button', function(e){
        
      var id = $(this).parents('.song').attr('id'),
          className = $(this).attr('class'),
          song = songList.find(id);

      // Edge case for unstarring and restarring a song
      if (!song && className === 'star') {song = starred.cache.find(id)};

      if (options.noDefaultQueue && className === 'play') {
        player.play(song);
        e.preventDefault();
        return false        
      };

      if (!song) {
        console.log('song not found in songlist');
        return false
      };

      eventHandlers[className](song, songList, $(this));
      $('#' + view).trigger(className, {id: id});

      e.preventDefault();
      return false
    });

    // $('#' + view).on('click', '.song',function(e){
      
    //   var id = $(this).attr('id'),
    //       song = songList.find(id);
      
    //   if (options.noDefaultQueue) {
    //     player.play(song);
    //     e.preventDefault();
    //     return false        
    //   };

    //   eventHandlers['play'](song, songList, $(this));
    //   $('#' + view).trigger('playSong', {id: id});

    //   e.preventDefault();
    //   return false
    // });


   };

   function removeListener (view) {
    $('#' + view).off();
   };

   return exports;

}());