$(function() {

   var appPrefix = 'musicfinder';

   window.player = new Player();
   
   discover().init();
   Song().init();
   

   
});