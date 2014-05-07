var Player = function () {

  var currentSong = {},
      userQueue = [],
      defaultQueue = [],
      playHistory = [],

      options = {
        repeat: false,
        shuffle: false
      };

  function play (song, nextSongs) {
    
    if (song) {
      currentSong = song
    }

    if (nextSongs) {
      defaultQueue = nextSongs
    }

    if (song.source === 'youtube') {
      youtubePlayer().play(currentSong)
    }
    
  }

  function pause () {
    mediaPlayer.pauseVideo()
  }

  function next () {
    addToHistory(currentSong);
    play(nextInQueue());
  };

  function previous () {
    addToQueue(currentSong);
    play(lastPlayed());
  };

  function nextInQueue () {
    if (userQueue.length > 0) {
      return userQueue.shift()
    } else if (defaultQueue.length > 0) {
      return defaultQueue.shift()
    } else {
      return 
    }
  };

  function loadMediaPlayers () {

    // Youtube
    youtubePlayer().init(function(){

    });

    // Soundcloud
    // ....

  }

  function addUIListener () {

  }

  function addToHistory(song) {
    playHistory.unshift(song);
  }

  function lastPlayed() {
    return playHistory.shift();
  }

  function queueSong () {

  }

  function removeSong () {

  }

  function init () {
    addUIListener();      
    loadMediaPlayers();
  }

  return {
    init: init,
    play: play,
    pause: pause,
    next: next,
    previous: previous,

    queueSong: queueSong,
    removeSong: removeSong
  }

};