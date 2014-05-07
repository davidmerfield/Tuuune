var youtubePlayer = function () {

  var player;

  function init (callback) {

    var params = {allowScriptAccess: "always"};

    swfobject.embedSWF("http://www.youtube.com/v/pYVW0I-NnDc&enablejsapi=1&playerapiid=youtubeEmbed", "youtubeEmbed", "425", "365", "8", null, null, params);

    window.onYouTubePlayerReady = function (playerID) {
      
      console.log('Youtube player loaded.');

      youtubeEmbed.addEventListener('onStateChange', 'youtubePlayer.stateChange');

      callback();

    };

  }
  
  function play (song) {
      if (song) {
         youtubeEmbed.loadVideoById(song.sourceID)
      }
      else {
        youtubeEmbed.playVideo()
      }
   }

   function pause () {
      player.pauseVideo()
   }

   function currentState () {
      
   }

   return {
      init: init,
      play: play,
      pause: pause,
      currentState: currentState
   } 
};

youtubePlayer.stateChange = function(e) {
  console.log('Youtube player state changed');
  switch (e) {
    case 0: // song ended
      Player().next();
    case 1: // playing
    case 2: // paused
    case 3: // buffering
      console.log('player is buffering');
    case 4: // video queued
  }
}