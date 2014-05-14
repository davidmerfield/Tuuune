var queue = (function(){
   
   var exports = {
         init: init,
         hide: hide
       };
   
   function init () {
      $('#queue').show();
      render();
   };

   function hide () {
      $('#queue').hide();
   };

   function render() {
      var queue = player.getQueue();

      var html = '';

      for (var i in queue.user) {
        var song = queue.user[i];
        html += Song().render(song);
      }

      for (var i in queue.auto) {
        var song = queue.auto[i];
        html += Song().render(song);
      }

      console.log(html);

      $('#queue .songList').html(html);

   };

   return exports

}());