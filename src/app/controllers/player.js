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

    $('#play').show();
    $('#pause').hide();

    youtubePlayer().pause();
    
  }

  function next () {

    addToHistory(currentSong);

    var nextSong = nextInQueue();

    play(nextSong);
  };

  function previous () {
    defaultQueue.unshift(currentSong);
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

  function updateProgressBar () {};

  function setState (val) {

    switch (val) {
      case 0: // song ended
        next();
      case 1: // playing
        console.log('player is player');
        setInterval(function(){

          console.log('updating progress bar');

          var progress = mediaPlayer().getProgress(),
              currentTime = progress.currentTime,

              mins = Math.floor(currentTime / 60),
              seconds = helper.pad(Math.floor(currentTime % 60),2);

          $('#currentTime').text(mins + ':' + seconds);
          $('#buffered').width(progress.bufferedPercent + '%');
          $('#progress').width(progress.playedPercent + '%');

        }, 100);
      case 2: // paused
        console.log('player is paused');
      case 3: // buffering
        console.log('player is buffering');
      case 4: // video queued
    }

  }

  function progressBar(e) {

      var xOffset = e.pageX - $('#progressBar').offset().left,
          ratio = xOffset/$('#progressBar').width(),
          seconds = Math.round(ratio*currentSong.duration/1000);

      console.log(seconds);

      return mediaPlayer().seekTo(seconds);
   
  }

  function addUIListener () {
    $('#controls a').click(function(e){
      
      var method = $(this).attr('id');

      switch (method) {
        case "progressBar":
          progressBar(e);break;
        case "play":
          play();break;
        case "pause":
          pause();break;
        case "next":
          next();break;
        case "previous":
          previous();break;
      }

      return false;

    })
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