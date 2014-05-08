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
  player.setState(e);
}