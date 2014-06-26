var player = (function() {

  var mediaPlayer, // e.g. Youtube
      
      currentSong, // The song currently being played
      
      // Contains the songs which will play next
      queue = {
        user: new SongList,
        auto: new SongList
      },

      // Contains the song the user has played
      playHistory = new SongList,

      options = {
        repeat: false,
        shuffle: false
      },

      exports = {
        init: init,

        play: play,
        pause: pause,
        next: next,
        previous: previous,

        history: playHistory,
        queue: getQueue,
        addToQueue: addToQueue
      };

  function init () {
    
    var players = [youtubePlayer, soundcloudPlayer];

    bindEventHanders();

    loadMediaPlayers(players, function(status){
        
      console.log(status);
    });
  };

  function hide () {
    unbindEventHandlers();
  };

  function loadMediaPlayers (players, callback) {
    
    if (players.length === 0) {
      return callback('All players loaded')
    };

    // Init adds each media player to the DOM
    players[0].init(function(status){
      loadMediaPlayers(players.slice(1), callback)
    });

  };

  function play (newSong, defaultQueue) {

    // We've got nothing to play
    if (!newSong && !currentSong && !defaultQueue) {return};

    // Play the currently loaded song
    if (!newSong && currentSong) {return mediaPlayer.play()};

    // Store the default queue to find the next songs from
    if (defaultQueue) {queue.auto = defaultQueue};

    // Prepare the player to play the new song
    if (newSong) {

      // Make sure we use the correct player to play the song
      setCurrentPlayer(newSong.source.name);

      // Store the new song as the current song
      setCurrentSong(newSong);

      // Start playing the new song
      return mediaPlayer.play(currentSong);

    };
        
  }

  function pause () {
    mediaPlayer.pause();    
  }

  function next () {

    var nextSong = nextInQueue();

    if (nextSong) {play(nextSong)};
        
  };

  function nextInQueue () {
    
    // Check if the user has queued any songs
    if (queue.user.length > 0) {
      return queue.user.shift()
    }

    // this will return false if current song is removed from songlist
    var defaultQueue = queue.auto.findAfter(currentSong.id);

    // check playhistory if this is the case, or go to start of songlist

    // Check if there are any songs which should auto play
    if (defaultQueue.length > 0) {
      return defaultQueue.shift()
    }

    // Otherwise
    return false
    
  };

  function previous () {

    var previousSong = lastPlayed();

    if (previousSong) {play(previousSong)};
  };

  function lastPlayed() {

    if (playHistory.length > 1) {
      return playHistory[1] 
    };
    
    var previousSongs = queue.auto.findBefore(currentSong.id);

    if (previousSongs.length > 0) {
       return previousSongs.pop();
    };

    return false

  };

  function getQueue () {

    // No song, no queue!
    if (!currentSong) {return false};

    var userQueue = queue.user,
        defaultQueue = new SongList(queue.auto.findAfter(currentSong.id));

    return {
      user: userQueue,
      auto: defaultQueue
    };
  };

  function addToQueue (song) {
    queue.user.push(song);
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

  function dropCurrentPlayer () {
    
    mediaPlayer.stop();

    $(mediaPlayer).off();
    
    mediaPlayer = undefined;

  };

  function setCurrentSong (song) {

    currentSong = song;

    var isStarred = song.isStarred ? 'starred' : '';

    $('#player #star').attr('data-isStarred', isStarred)
    $('#songTitle').text(currentSong.pretty.title);
    $('#songDuration').text(currentSong.pretty.duration);

    drawProgressBar(true);

    // add last played song to history
    playHistory.unshift(currentSong);

    // we emit this event so the history view knows when to rerender
    $(exports).trigger('songChange');

  };

  function setCurrentPlayer (playerName) {
    
    // reset the progress bar
    drawProgressBar(true);

    if (currentSong && playerName !== currentSong.source.name) {
      dropCurrentPlayer();
    };

    if (currentSong && playerName === currentSong.source.name) {
      return
    };

    if (playerName === 'youtube') {
      mediaPlayer = youtubePlayer;
      $('#embeds').attr('class', '');
    };

    if (playerName === 'soundcloud') {
      mediaPlayer = soundcloudPlayer;
      $('#embeds').attr('class', 'hidden');
    };


    var progressInterval;
    
    $(mediaPlayer).on('finished', function(){
      console.log('SONG FINISHED ---- PLAYER EVENT');
      $('#play').show();
      $('#pause').hide();
      clearInterval(progressInterval);
      drawProgressBar(true);
      next();
    });

    $(mediaPlayer).on('playing', function(){
      $('#play').hide();
      $('#pause').show();
      console.log('SONG PLAYING ---- PLAYER EVENT');
      progressInterval = setInterval(drawProgressBar, 100);
    });

    $(mediaPlayer).on('paused', function(){
      console.log('SONG PAUSED ---- PLAYER EVENT');
      
      $('#play').show();
      $('#pause').hide();


      clearInterval(progressInterval);
    });

  };

  function star() {

    console.log('HERERED');

    if (!currentSong) {return};

    if (currentSong.isStarred) {
      starred.unstar(currentSong);
      $('#controls #star').attr('data-isStarred', '');
    } else {
      $('#controls #star').attr('data-isStarred', 'starred');
      starred.star(currentSong);
    };

  };

  function bindEventHanders () {

    $('#controls a').on('click', function(e){
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
        case "star":
          star();break;
      }

      return false;
    });

  };

  function unbindEventHandlers () {
    $('#controls a').off();
  };

  function progressBar(e) {

      var xOffset = e.pageX - $('#progressBar').offset().left,
          ratio = xOffset/$('#progressBar').width(),
          seconds = Math.round(ratio*currentSong.duration/1000);

      return mediaPlayer.seekTo(seconds);
   
  };

  return exports

}());

// :D