Tuuune.player = (function() {

  var SongList = include('SongList'),

      mediaPlayer, // e.g. Youtube
      
      mediaPlayers, // List of available media players
      
      currentSong, // The song currently being played
      
      // Contains the songs which will play next
      queue = {
        user: new SongList,
        auto: new SongList
      },

      // Contains the songs the user has played
      songHistory = new SongList,

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

        songHistory: songHistory,
        queue: getQueue,
        addToQueue: addToQueue
      };

  function init () {

    mediaPlayers = [youtubePlayer, soundcloudPlayer];

    loadMediaPlayers(mediaPlayers, function(status){
        
      console.log(status);
      bindEventHanders();
      
      if (currentSong) {play(currentSong)};

    });
  };

  function hide () {
    unbindEventHandlers();
  };

  function loadMediaPlayers (players, callback) {
    
    if (!players.length) {return callback('Players loaded')};

    // Init adds each media player to the DOM
    players[0].init(function(status){

      loadMediaPlayers(players.slice(1), callback)

    });

  };

  function play (newSong, defaultQueue) {

    // We've got nothing to play
    if (!newSong) {return};

    // Store the default queue to find the next songs from
    if (defaultQueue) {queue.auto = defaultQueue};

    // Prepare the player to play the new song
    if (newSong) {

      $('body').addClass('playerUsed');
      
      $('.song')
        .removeClass('playing')
        .removeClass('loading');

      songHistory.unshift(newSong);

      // Make sure we use the correct player to play the song
      setPlayerTo(newSong, function(){

        currentSong = newSong;

        playToggle(true);

        // Start playing the new song
        mediaPlayer.play(currentSong);

      });
    };    
  };

  function playToggle (isPlaying) {
    
    if (isPlaying) {

      mediaPlayer.play();

      $('#play').hide();
      $('#pause').show();

    } else {

      mediaPlayer.pause();

      $('#play').show();
      $('#pause').hide();        
    };
  };

  function pause () {
    mediaPlayer.pause();    
  }

  function next () {

    var nextSong = (function(queue) {

      // Check if the user has queued any songs
      if (queue.user.length > 0) {
         return queue.user.shift()
      }

      // this will return false if current song is removed from songlist
      var defaultQueue = queue.auto.findAfter(currentSong.id);
      // check songHistory if this is the case, or go to start of songlist

      // Check if there are any songs which should auto play
      if (defaultQueue.length > 0) {
        return defaultQueue.shift()
      }

      return false

    }(queue));

    return play(nextSong);
  };

  function previous () {

    var previousSong = (function(queue) {

      if (songHistory.length) {return songHistory[1]};
      
      var previousSongs = queue.auto.findBefore(currentSong.id);

      if (previousSongs.length) {return previousSongs.pop()};

      return false

    }(queue));

    return play(previousSong);
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
    $('#' + song.id + ' .addToQueue').text('✔ Added');
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

  function setPlayerTo (newSong, callback) {

    var newPlayerName = newSong.source.name;

    // we emit this event so the history view knows when to rerender
    $(exports).trigger('songChange');
    
    // Add new song info to player
    document.title = newSong.pretty.title;

    $('#' + newSong.id).addClass('loading');

    $('#songTitle').text(newSong.pretty.title);
    $('#player .thumbnail').html('<img src="' + newSong.thumbnail + '" />');
    $('#songDuration').text(newSong.pretty.duration);
    var isStarred = newSong.isStarred ? 'starred' : '';
    $('#player #permalink').attr('href', newSong.source.permalink);
    $('#player #star').attr('data-isStarred', isStarred);

    // Reset the progress bar
    drawProgressBar(true);

    if (!currentSong || currentSong.source.name !== newPlayerName) {

      if (currentSong) {dropCurrentPlayer()};
      
      if (newPlayerName === 'youtube') {
        mediaPlayer = youtubePlayer;
        $('#player .thumbnail').hide();
        $('#embeds').attr('class', '');
      };

      if (newPlayerName === 'soundcloud') {
        mediaPlayer = soundcloudPlayer;
        $('#player .thumbnail').show();
        $('#embeds').attr('class', 'hidden');
      };

      var progressInterval;
      
      $(mediaPlayer).on('finished', function(){
        console.log('SONG FINISHED ---- PLAYER EVENT');
        playToggle(false);
        clearInterval(progressInterval);
        drawProgressBar('reset');
        next();
      });

      $(mediaPlayer).on('playing', function(){
        console.log('SONG PLAYING ---- PLAYER EVENT');
        progressInterval = setInterval(drawProgressBar, 100);
        $('#' + newSong.id).attr('class', 'song playing');
        $('#play').hide();
        $('#pause').show();        
      });

      $(mediaPlayer).on('paused', function(){
        playToggle(false);
        console.log('SONG PAUSED ---- PLAYER EVENT');
        clearInterval(progressInterval);
      });
    };

    return callback()
  };

  function star() {

    
    var starred = include('starred');
    
    starred.toggle(currentSong);

    $('#star').attr('data-isStarred', currentSong.isStarred);

  };

  function bindEventHanders () {

    $('#controls a').on('click', function(e){
      var method = $(this).attr('id');

      switch (method) {
        case "permalink":
          return pause();
        case "progressBar":
          progressBar(e);break;
        case "play":
          playToggle(true);break;
        case "pause":
          playToggle(false);break;
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