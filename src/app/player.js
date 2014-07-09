Tuuune.player = (function() {

  var Song = include('Song'),
      SongList = include('SongList'),

      playerEl = '#player',
      progressEl = '.progressBar',

      mediaPlayers, mediaPlayer,
      currentSong, queue, songHistory,

      options = {
        repeat: false,
        shuffle: false
      };

  function init () {
    
    // Load other modules
    queue = include('queue');
    mediaPlayers = include('players');
    songHistory = include('songHistory');

    // We use external services to stream music
    loadPlayers(function(){

      console.log('Players loaded.');

      // Listen to song controls
      $(playerEl).on('click', '.song', queue, Song.listener);

      // Play song if one was clicked before player was started
      if (currentSong) {play(currentSong)};
    });
  };

  function play (song, defaultQueue) {

    if (!song) {throw 'Please specify a song to play'};   

    // The songs which are before and after the new song
    if (defaultQueue) {queue.set(defaultQueue)};

    // Prepare the player to play the new song
    load(song, function(){

      // Make sure we're playing the right song
      if (song.id === currentSong.id) {return mediaPlayer.play()}
      
      // Shit noooooo
      console.log('we are now on a different song')
    });
  };

  function load (song, callback) {

    var source = song.source.name;

    if (!mediaPlayers[source]) {return console.log('No player for song')};

    // Add new song info to player
    document.title = song.pretty.title;

    $(playerEl)
      .attr('class', source)
      .find('.song')
        .attr('data-id', song.id)
        .html(Mustache.render(Song.playerTemplate, song));

    // Reset the progress bar
    renderProgress(true);
    clearInterval(progressInterval);          

    if (!currentSong || currentSong.source.name !== newPlayerName) {

      if (currentSong) {
        mediaPlayer.stop();
        $(mediaPlayer).off();    
        mediaPlayer = null;
      };
      
      if (!mediaPlayers[newPlayerName]) {throw 'No player called ' + newPlayerName};

      mediaPlayer = mediaPlayers[newPlayerName]

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
      
      songHistory.add(song);

      // we emit this event so the history view knows when to rerender
      $(playerEl).trigger('songChange');

      currentSong = song;

      return callback()
    });
  };

  function next () {
    return play(queue.after(currentSong));
  };

  function previous () {
    return play(queue.before(currentSong));
  };

  function toggle () {
    return mediaPlayer.toggle()
  };

  function pause () {
    return mediaPlayer.pause()
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

  function seek (mouseX) {

    var xOffset = mouseX - $(progressEl).offset().left,
        ratio = xOffset/$(progressEl).width(),
        seconds = Math.round(ratio*currentSong.duration/1000);

    return mediaPlayer.seekTo(seconds);
   
  };

  function loadPlayers (callback) {
    mediaPlayers.youtube.init(function(){
      mediaPlayers.soundcloud.init(function(){
        return callback()
      });
    });
  };

  function hide () {
    $(playerEl).off();
  };

  return {
    init: init,
    hide: hide,

    play: play,
    pause: pause,
    toggle: toggle,
    next: next,
    previous: previous,
    seek: seek
  }

}());