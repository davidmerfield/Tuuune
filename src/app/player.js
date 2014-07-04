Tuuune.player = (function() {

  var Song = include('Song'),
      SongList = include('SongList'),

      playerEl = '#player',
      progressEl = '.progressBar',

      mediaPlayers,
      mediaPlayer, // e.g. Youtube
            
      currentSong,
      progressInterval,
      notReady = true,

      options = {
        repeat: false,
        shuffle: false
      },

      exports = {
        init: init,
        hide: hide,

        play: play,
        pause: pause,
        toggle: toggle,
        setProgress: setProgress
      };

  function init () {
    
    // Listen to song controls
    Song.addListener(playerEl);

    // We use external services to stream music, 
    // Load their players
    loadPlayers(function(){
      
      // Play song if one was clicked before player was started
      if (currentSong) {play(currentSong)};

      notReady = false;
    });
  };

  function play (song, defaultQueue) {

    if (!song) {throw 'Please specify a song to play'};   

    // The songs which are before and after the new song
    if (defaultQueue) {
      var queue = include('queue');
          queue.set(defaultQueue)
    };

    // Player is not yet ready, this needs better system
    if (notReady) {return}

    // Prepare the player to play the new song
    load(song, function(){

      return mediaPlayer.play();

    });
  };

  function toggle () {

    // Player is not yet ready, this needs better system    
    if (notReady) {return}
    
    mediaPlayer.toggle()
  };

  function pause () {

    // Player is not yet ready, this needs better system
    if (notReady) {return}

    mediaPlayer.pause()
  };

  function renderProgress (reset) {

    if (reset) {
      $('.currentTime').text('0:00');
      $('.progress').width('0%');
      return 
    };

    var currentTime = mediaPlayer.getCurrentTime();
        playedPercent = (currentTime/currentSong.duration)*100*1000,

        mins = Math.floor(currentTime / 60),
        seconds = helper.pad(Math.floor(currentTime % 60),2);

    $('.currentTime').text(mins + ':' + seconds);
    $('.progress').width(playedPercent + '%');

  };


  function load (song, callback) {

    var newPlayerName = song.source.name;

    // Add new song info to player
    document.title = song.pretty.title;

    $('#player .song')
      .attr('data-id', song.id)
      .html(Mustache.render(Song.playerTemplate, song))

    if (newPlayerName === 'youtube') {
      $('#embeds').removeClass('hidden');
      $(playerEl + ' .thumbnail').hide();
    } else {
      $('#embeds').addClass('hidden');
    }

    // Reset the progress bar
    renderProgress(true);

    clearInterval(progressInterval);          

    if (!currentSong) {$(playerEl).addClass('show')};

    if (!currentSong || currentSong.source.name !== newPlayerName) {

      if (currentSong) {
        mediaPlayer.stop();
        $(mediaPlayer).off();    
        mediaPlayer = null;
      };
      
      if (!mediaPlayers[newPlayerName]) {throw 'No player called ' + newPlayerName};

      mediaPlayer = mediaPlayers[newPlayerName]
      var queue = include('queue');

      var songEl = '[data-id="' + song.id + '"]';
      
      $('.song')
        .removeClass('playing loading paused');
        
      $(songEl).addClass('loading');

      $(mediaPlayer)
        .on('playing', function(){
          console.log('Playing ' + song.pretty.title);              

          $(songEl)
            .addClass('playing')
            .removeClass('paused loading');

          progressInterval = setInterval(renderProgress, 100);                
        })
        .on('paused', function(){
          console.log('Paused ' + song.pretty.title);              

          $(songEl)
            .addClass('paused')
            .removeClass('playing loading');             
        })
        .on('finished', function(){
          console.log('Finished ' + song.pretty.title);              
          
          clearInterval(progressInterval);          

          $(songEl).removeClass('playing loading');   
          play(queue.after(song));
        });
    };

    mediaPlayer.load(song, function(){

      var songHistory = include('songHistory');
          songHistory.add(song);

      // we emit this event so the history view knows when to rerender
      $(exports).trigger('songChange');

      currentSong = song;

      return callback()
    });
  };

  function setProgress(mouseX) {

    var xOffset = mouseX - $(progressEl).offset().left,
        ratio = xOffset/$(progressEl).width(),
        seconds = Math.round(ratio*currentSong.duration/1000);

    return mediaPlayer.seekTo(seconds);
   
  };

  function loadPlayers (callback) {

    mediaPlayers = include('players');

    mediaPlayers.youtube.init(function(){

      mediaPlayers.soundcloud.init(function(){

        console.log('Players loaded.');

        return callback()
      });
    });
  };

  function hide () {
    $(playerEl).off();
  };

  return exports

}());