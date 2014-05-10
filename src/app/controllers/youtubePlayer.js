var youtubePlayer = (function(){

  var youtubeEmbed;

  function init (playerID, callback) {

    // Build the container which will house the youtube player
    var embedContainer = document.createElement('div');
        embedContainer.className = 'mediaEmbed';
        embedContainer.id = playerID;

    var embeds = document.getElementById('embeds');
        embeds.appendChild(embedContainer);

    // This function takes the embed container and swaps it
    // for an embed element. When it's done it calls 
    // onYouTubePlayerReady

    swfobject.embedSWF(
      "http://www.youtube.com/v/pYVW0I-NnDc&enablejsapi=1&playerapiid=" + playerID,
      playerID, "425", "365", "8", null, null, {allowScriptAccess: "always"}
    );

    return onYouTubePlayerReady = function (playerID) {
      
      youtubeEmbed = document.getElementById(playerID);
      youtubeEmbed.className = 'mediaEmbed';

      youtubeEmbed.addEventListener('onStateChange', 'youtubePlayer.eventHandler');
      

      callback('Youtube player loaded.');
    };
  };

  function eventHandler (eventID) {

    var eventName = (function(){
      switch (eventID) {
        case -1: return 'unstarted';
        case  0: return 'finished';
        case  1: return 'playing';
        case  2: return 'paused';
        case  3: return 'buffering';
        case  5: return 'queued';
      };
    }());

    $(this).trigger(eventName);

  };

  function play (song) {
    if (song) {
      youtubeEmbed.loadVideoById(song.sourceID)
    }
    else {
      youtubeEmbed.playVideo()
    }
  };

  function pause () {
    return youtubeEmbed.pauseVideo()
  };

  function stop () {
    return youtubeEmbed.stopVideo()
  };

  function seekTo(seconds) {
    return youtubeEmbed.seekTo(seconds, true);
  };

  function getCurrentTime() {
    return youtubeEmbed.getCurrentTime();
  };

  return {
    init: init,
    play: play,
    pause: pause,
    stop: stop,
    seekTo: seekTo,
    eventHandler: eventHandler,
    getCurrentTime: getCurrentTime
  };

}());