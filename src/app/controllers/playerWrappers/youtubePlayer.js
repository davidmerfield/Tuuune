var youtubePlayer = (function(){

  var embed,

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
          playerID = 'YC_EMBED';
    };

    // Build the container which will house the youtube player
    var embedContainer = document.createElement('div');
        embedContainer.id = playerID;

    var embeds = document.getElementById('embeds');
        embeds.appendChild(embedContainer);

    // This swaps the embed container with a YT player
    swfobject.embedSWF(
      "http://www.youtube.com/v/pYVW0I-NnDc&controls=0&iv_load_policy=3&modestbranding&showinfo=0&enablejsapi=1&playerapiid=" + playerID,
      playerID, "266", "200", "8", null, null, {allowScriptAccess: "always"}
    );

    // The youtube embed will call this in the context
    // of window when it's ready to recieve calls.
    return window.onYouTubePlayerReady = function (playerID) {

      embed = document.getElementById(playerID);
      embed.className = 'mediaEmbed';

      embed.addEventListener('onStateChange', 'youtubePlayer.eventHandler');

      callback('Youtube player loaded.');
    };
  };

  function play (song) {

    embed.unMute();

    if (song) {
      embed.loadVideoById(song.source.id, 0, 'small')
    }
    else {
      embed.playVideo()
    }
  };

  function pause () {
    return embed.pauseVideo()
  };

  function stop () {
    embed.mute()
    return embed.stopVideo()
  };

  function seekTo(seconds) {
    return embed.seekTo(seconds, true);
  };

  function getCurrentTime() {
    return embed.getCurrentTime();
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

    $(exports).trigger(eventName);

  };

  return exports

}());