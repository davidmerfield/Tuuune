$(function() {

   var appPrefix = 'musicfinder';

   nav.init('discover');

   player.init();
   
   Song().init();
      
   starred.reset();
   
});