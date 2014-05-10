var soundcloudPlayer = (function(SC){

   var widget, soundcloudEmbed,
       currentTime,
       checkCurrentTime = false;

   function init (playerID, callback) {
      
      var embedContainer = document.createElement('iframe');
          embedContainer.id = playerID;
          embedContainer.src = "https://w.soundcloud.com/player/?url=";
          embedContainer.className = "mediaEmbed";

      var embeds = document.getElementById('embeds');
          embeds.appendChild(embedContainer);

      widget = SC.Widget(embedContainer);
      
      bindEvents();

      callback('Soundcloud player ready');

   }; 

   function setCurrentTime () {

      widget.getPosition(function(position){

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
            $(soundcloudPlayer).trigger(eventName);
         };

      };

   };

   function bindEvents () {
      
      for (var eventKey in SC.Widget.Events) {

         var eventName = SC.Widget.Events[eventKey];

         widget.bind(eventName, eventHandler(eventName));

      };
   }

   function play (song) {
      if (song) {
         widget.load(song.url, {auto_play: true});
         currentTime = 0;
      } else {
         widget.play();
      }
   }

   function pause () {
      widget.pause();
   }

   function stop () {
      widget.pause();
   }

   function seekTo (seconds) {
      widget.seekTo(seconds*1000);
   }

   return {
      init: init,
      play: play,
      pause: pause,
      stop: stop,
      seekTo: seekTo,
      getCurrentTime: getCurrentTime
   }

}(SC));