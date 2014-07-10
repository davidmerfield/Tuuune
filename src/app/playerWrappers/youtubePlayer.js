Tuuune.players.youtube = (function(){

  var playerName = 'youtube',

      embed,
      embedContainer,
      embeds,

      exports = {
        init: init,
        load: load,
        toggle: toggle,
        play: play,
        pause: pause,
        stop: stop,
        seekTo: seekTo,
        eventHandler: eventHandler,
        getCurrentTime: getCurrentTime
      };

  function init (callback) {

    embeds = document.getElementById('embeds');

    var playerID = playerName + '_' + embeds.childNodes.length;

    // Build the container which will house the youtube player
    embedContainer = document.createElement('div');
    embedContainer.id = playerID;
    embedContainer.innerHTML = "You don't have flash, please download the latest verion."; 

    embeds.appendChild(embedContainer);

    // This swaps the embed container with a YT player
    swfobject.embedSWF(
      "http://www.youtube.com/v/pYVW0I-NnDc&controls=0&iv_load_policy=3&modestbranding&showinfo=0&enablejsapi=1&playerapiid=" + playerID,
      playerID, "200", "200", "8", null, null, {allowScriptAccess: "always"}
    );

    // The youtube embed will call this in the context
    // of window when it's ready to recieve calls.
    return window.onYouTubePlayerReady = function (playerID) {

      embed = document.getElementById(playerID);
      embed.className = playerName;    

      embed.addEventListener('onStateChange', 'Tuuune.players.youtube.eventHandler');

      callback(playerName + 'player ready');
    };
  };

  function play () {
    return embed.playVideo();
  };

  function load (song, callback) {
    embed.cueVideoById(song.source.id, 0, 'small');
    return callback();
  };

  function pause () {
    return embed.pauseVideo()
  };

  function toggle () {
    var state = embed.getPlayerState();
    if (state == 1) {pause()};
    if (state == 2) {play()};
  };

  function stop () {
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