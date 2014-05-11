$(function() {

   var appPrefix = 'musicfinder';

   window.player = new Player();
   
   discover().init();
   Song().init();
   
   $('#starredNav').click(function(){
      $('#discover').hide();
      $('#starred').show();
   });

   $('#discoverNav').click(function(){
      $('#discover').show();
      $('#starred').hide();
   });

});