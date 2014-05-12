// :D

var player = (function() {

  var currentSong,

      mediaPlayer,

      options = {
        repeat: false,
        shuffle: false
      },

      queue = {
        user: [],
        auto: [],
        history: []
      },

      exports = {
        init: init,
        play: play,
        pause: pause,
        next: next,
        previous: previous
      };

  function init () {
    
    var players = [youtubePlayer, soundcloudPlayer];

    loadMediaPlayers(players, function(status){
      
      console.log(status);

      addUIListener();
    });
  }

  function loadMediaPlayers (players, callback) {
    
    if (players.length === 0) {return callback('All players loaded')};

    players[0].init(function(status){
      loadMediaPlayers(players.slice(1), callback)
    });

  };

  function play (song, nextSongs) {

    if (!song && !currentSong && !nextSongs) {
      return
    }

    $('#play').hide();
    $('#pause').show();

    if (nextSongs) {
      defaultQueue = nextSongs
    };

    if (song) {

      if (currentSong) {
        unbindEvents();
        mediaPlayer.stop();
      };

      currentSong = song;
      drawProgressBar(true);

      if (song.source === 'youtube') {
        mediaPlayer = youtubePlayer;
        bindEvents();
      }

      if (song.source === 'soundcloud') {
        mediaPlayer = soundcloudPlayer
        bindEvents();
      }

      $('#songTitle').text(currentSong.pretty.title);
      $('#songDuration').text(currentSong.pretty.duration);

      return mediaPlayer.play(currentSong);

    };
    
    return mediaPlayer.play();
    
  }

  function pause () {

    $('#play').show();
    $('#pause').hide();

    mediaPlayer.pause();
    
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

  function drawProgressBar(reset) {

    if (reset) {
      $('#currentTime').text('0:00');
      $('#progress').width('0%');
      return 
    };

    var currentTime = mediaPlayer.getCurrentTime();
        playedPercent = (currentTime/currentSong.duration)*100*1000,

        mins = Math.floor(currentTime / 60),
        seconds = helper.pad(Math.floor(currentTime % 60),2);

    $('#currentTime').text(mins + ':' + seconds);
    $('#progress').width(playedPercent + '%');

  };

  function unbindEvents () {
    $(mediaPlayer).off('finished', 'playing', 'paused');
  };

  function bindEvents () {
    
    var progressInterval;

    $(mediaPlayer).on('finished', function(){
      console.log('SONG FINISHED ---- PLAYER EVENT');
      clearInterval(progressInterval);
      drawProgressBar(true);
      next();
    });

    $(mediaPlayer).on('playing', function(){
      console.log('SONG PLAYING ---- PLAYER EVENT');
      progressInterval = setInterval(drawProgressBar, 100);
    });

    $(mediaPlayer).on('paused', function(){
      console.log('SONG PAUSED ---- PLAYER EVENT');
      clearInterval(progressInterval);
    });

  };

  function progressBar(e) {

      var xOffset = e.pageX - $('#progressBar').offset().left,
          ratio = xOffset/$('#progressBar').width(),
          seconds = Math.round(ratio*currentSong.duration/1000);

      return mediaPlayer.seekTo(seconds);
   
  };

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

    });

  };

  function addToHistory(song) {
    playHistory.unshift(song);
  };

  function lastPlayed() {
    return playHistory.shift();
  };

  function queueSong () {

  };

  function removeSong () {

  };

  return exports

}());