var history = (function(){
   
   var exports = {
         init: init,
         hide: hide
       };
   
   function init () {
      $('#history').show();
      render();
      $(player).on('nextSong', function(){
         render();
      });

   };

   function hide () {
      $('#history').hide();
   };

   function render() {
      var queue = player.getQueue();

      var html = '';

      for (var i in queue.history) {
        var song = queue.history[i];
        html += Song().render(song);
      }

      $('#history .songList').html(html);

   };

   return exports

}());