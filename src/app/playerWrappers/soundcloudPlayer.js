Tuuune.players.soundcloud = (function(SC){

  var playerName = 'soundcloud',

      embed,
      embedContainer,
      embeds,

     currentTime,

     exports = {
       init: init,
       play: play,
       toggle: toggle,
       load: load,
       pause: pause,
       stop: stop,
       seekTo: seekTo,
       eventHandler: eventHandler,
       getCurrentTime: getCurrentTime
    };

   function init (callback) {

      embeds = document.getElementById('embeds');
      
      var playerID = playerName + '_' + embeds.childNodes.length;

      embedContainer = document.createElement('iframe');
      embedContainer.id = playerID;
      embedContainer.src = "https://w.soundcloud.com/player/?url=";
      embedContainer.className = playerName;

      embeds.appendChild(embedContainer);

      embed = SC.Widget(embedContainer);
      
      bindEvents();

      callback(playerName + ' player ready');

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

             case 'play':
               return 'playing';

             case 'pause': 
              return 'paused';

             case 'finish':
              return 'finished';
             
             case 'playProgress':
              setCurrentTime();
           };
         }());

         if (eventName) {$(exports).trigger(eventName)};

      };

   };

   function bindEvents () {
      
      for (var eventKey in SC.Widget.Events) {

         var eventName = SC.Widget.Events[eventKey];

         embed.bind(eventName, eventHandler(eventName));

      };
   };

   function play () {
    return embed.play();
   };

   function load (song, callback) {
    currentTime = 0;
    embed.load(song.source.url, {callback: callback});
   };

   function pause () {
    embed.pause();
   };

   function toggle () {
    embed.isPaused(function(paused){

      if (paused) {return embed.play()};

      return embed.pause();
    });
   };

   function stop () {
      currentTime = 0;
      embed.pause();
   };

   function seekTo (seconds) {
      embed.seekTo(seconds*1000);
   };

   return exports

}(SC));