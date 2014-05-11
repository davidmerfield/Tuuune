$(function() {

   var appPrefix = 'musicfinder';

   player.init();
   
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