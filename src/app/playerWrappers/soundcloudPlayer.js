var soundcloudPlayer = (function(SC){

   var embed,
       currentTime,

       exports = {
         init: init,
         play: play,
         pause: pause,
         stop: stop,
         seekTo: seekTo,
         eventHandler: eventHandler,
         getCurrentTime: getCurrentTime
      };

   function init (playerID, callback) {
      
      if (typeof playerID === 'function') {
        var callback = playerID,
            playerID = 'SC_EMBED';
      };

      var embedContainer = document.createElement('iframe');
          embedContainer.id = playerID;
          embedContainer.src = "https://w.soundcloud.com/player/?url=";
          embedContainer.className = "mediaEmbed";

      var embeds = document.getElementById('embeds');
          embeds.appendChild(embedContainer);

      embed = SC.Widget(embedContainer);
      
      bindEvents();

      callback('Soundcloud player ready');

   }; 

   function setCurrentTime () {

      embed.getPosition(function(position){

         currentTime = position/1000;
      });
   };

   function getCurrentTime() {
      return currentTime
   };

   function eventHandler(eventID) {

      return function(eventData) {

         var eventName = (function(){
           switch (eventID) {
             case 'play': return 'playing';
             case 'pause': return 'paused';
             case 'finish': return 'finished';
             case 'playProgress': setCurrentTime();
           };
         }());

         if (eventName) {
            $(exports).trigger(eventName);
         };

      };

   };

   function bindEvents () {
      
      for (var eventKey in SC.Widget.Events) {

         var eventName = SC.Widget.Events[eventKey];

         embed.bind(eventName, eventHandler(eventName));

      };
   };

   function play (song) {
    embed.setVolume(100);
      if (song) {
         embed.load(song.source.url, {auto_play: true});
         currentTime = 0;
      } else {
         embed.play();
      }
   };

   function pause () {
      embed.pause();
      embed.setVolume(0);
   };

   function stop () {
      embed.setVolume(0);
      embed.pause();
   };

   function seekTo (seconds) {
      embed.seekTo(seconds*1000);
   };

   return exports

}(SC));