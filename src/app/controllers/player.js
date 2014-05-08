function Player () {

  var currentSong,
      
      mediaPlayer,
      availablePlayers = {},

      userQueue = [],
      defaultQueue = [],
      playHistory = [],

      options = {
        repeat: false,
        shuffle: false
      };

  init();

  function init () {
    addUIListener();      
    loadMediaPlayers();
  }

  function play (song, nextSongs) {

    mediaPlayer = youtubePlayer;
    
    if (song) {

      currentSong = song;
      mediaPlayer().play(currentSong);

      $('#songTitle').text(currentSong.title);
      $('#songDuration').text(currentSong.pretty.duration);

    } else {
      mediaPlayer().play();      
    }

    if (nextSongs) {


      console.log('NEW Default QUEUE');
      console.log(nextSongs);

      defaultQueue = nextSongs
    }

    $('#play').hide();
    $('#pause').show();
    
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


  this.play = play;
  this.pause = pause;
  this.next = next;
  this.previous = previous;
  this.progressBar = progressBar;

  this.setState = setState;

  return

};