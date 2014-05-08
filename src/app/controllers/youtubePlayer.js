var youtubePlayer = function () {

  function init (callback) {

    var params = {allowScriptAccess: "always"};

    swfobject.embedSWF(
      "http://www.youtube.com/v/pYVW0I-NnDc&enablejsapi=1&playerapiid=youtubeEmbed",
      "youtubeEmbed", "425", "365", "8", null, null, params
    );

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
    youtubeEmbed.pauseVideo()
  }

  function stop () {
    youtubeEmbed.stopVideo()
  }

  function seekTo(seconds) {
    youtubeEmbed.seekTo(seconds, true);
  }

  function getProgress() {

    var currentTime = youtubeEmbed.getCurrentTime(),
        mins = Math.floor(currentTime / 60),
        seconds = helper.pad(Math.floor(currentTime % 60),2);

    return {
      currentTime: currentTime,
      duration: youtubeEmbed.getDuration(),
      playedPercent: currentTime/youtubeEmbed.getDuration()*100,
      bufferedPercent: youtubeEmbed.getVideoLoadedFraction()*100
    }
  }

  return {
    init: init,
    play: play,
    pause: pause,
    getProgress: getProgress,
    seekTo: seekTo
  }

};

youtubePlayer.stateChange = function(e) {
  console.log('Youtube player state changed');
  player.setState(e);
}