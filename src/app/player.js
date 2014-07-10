Tuuune.player = (function() {

  var Song = include('Song'),
      SongList = include('SongList'),

      playerEl = '#player',

      mediaPlayers, mediaPlayer,
      currentSong, queue, songHistory;

  function init () {
    
    // Load other modules
    queue = include('queue');
    mediaPlayers = include('players');
    songHistory = include('songHistory');

    // Listen to song controls
    $(playerEl).on('click', '.song', queue, Song.listener);

    // We use external services to stream music
    loadPlayers(function(){

      console.log('Players loaded.');

      // Play song if one was clicked before player was started
      if (currentSong) {play(currentSong)};
    });
  };

  function play (song, defaultQueue) {

    // No song to play
    if (!song) {throw 'Please specify a song to play'};   

    // The songs which are before and after the new song
    if (defaultQueue) {queue.set(defaultQueue)};

    // Update reference to currentSong
    var previousPlayer = currentSong ? currentSong.source.name : false;
        currentSong = song;

    $('#howItWorks').hide();

    // Prepare the player to play the new song
    load(song, previousPlayer, function(){

      // Make sure we're playing the right song
      if (song.id === currentSong.id) {

        // Save that we've played this song
        songHistory.add(song);

        // we emit this event so the history view knows when to rerender
        $(playerEl).trigger('songChange');

        return mediaPlayer.play()
      };
      
      // Shit noooooo
      console.log('ABORT: we are now on a different song')
    });
  };

  function load (song, previousPlayer, callback) {

    var newPlayer = song.source.name;

    if (!mediaPlayers[newPlayer]) {return callback('No player for song')};

    // We need to instantiate a new player
    if (previousPlayer !== newPlayer) {
      
      if (previousPlayer) {
        mediaPlayer.stop();
        $(mediaPlayer).off();            
      }

      mediaPlayer = mediaPlayers[newPlayer];
      $(mediaPlayer).on('playing paused finished', eventHandler);
    }

    // Update player to show this song
    render(song);

    // Set the song's state as loading
    $('[data-id="' + currentSong.id + '"]').attr('data-state', 'loading');

    mediaPlayer.load(song, function(){  
      return callback()
    });
  };

  function render (song) {
    var template = 
      '<span class="thumbnail" data-action="togglePlay" style="background: url({{thumbnail}}) no-repeat center center;background-size: cover"><img src="" /></span>' +
      '<span class="title">{{pretty.title}}</span> ' +
      '<span class="progressBar" data-action="seek">' +
        '<span class="currentTime">0:00</span>' +
        '<span class="progress"></span>' +
        '<span class="duration">{{pretty.duration}}</span>' +
      '</span>' +
      '<section class="controls">' +
        '<button class="previous" data-action="previous"></button>' +
        '<button class="togglePlay" data-action="togglePlay"></button>' +
        '<button class="next" data-action="next"></button>' +
        '<a class="permalink" data-action="permalink" target="_blank" href="{{source.permalink}}">&#9099;</a>' +
        '<button class="star" data-action="star" data-isStarred="{{isStarred}}">&#9733;</button>' +
      '</section>';

    // Add new song info to player
    document.title = song.pretty.title;

    drawProgressBar('stop');

    $(playerEl)
      .attr('class', song.source.name)
      .find('.song')
        .attr('data-id', song.id)
        .html(Mustache.render(template, song));
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

  function eventHandler (e) {

    var songEl = '[data-id="' + currentSong.id + '"]';
        name = e.type;

    console.log(name + ' ' + currentSong.pretty.title);              

    $(songEl).attr('data-state', name);
    
    switch (name) {
      case 'playing':
        drawProgressBar();
        break;
      case 'paused':
        drawProgressBar('stop');
        break;
      case 'finished':
        drawProgressBar('stop');
        play(queue.after(currentSong));
        break;
    };
  };

  function drawProgressBar (stop) {
    if (stop) {return clearInterval(window.progressInterval)};
    window.progressInterval = setInterval(renderProgress, 100);      
  };

  function renderProgress (position) {

    var currentTime = mediaPlayer.getCurrentTime();
        playedPercent = (currentTime/currentSong.duration)*100*1000,

        mins = Math.floor(currentTime / 60),
        seconds = helper.pad(Math.floor(currentTime % 60),2);

    $('.currentTime').text(mins + ':' + seconds);
    $('.progress').width(playedPercent + '%');

  };

  function seek (mouseX) {

    // Set the song's state as loading
    $('[data-id="' + currentSong.id + '"]').attr('data-state', 'loading');

    var xOffset = mouseX - $('.progressBar').offset().left,
        ratio = xOffset/$('.progressBar').width(),
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

  return {
    init: init,

    play: play,
    pause: pause,
    toggle: toggle,
    next: next,
    previous: previous,
    seek: seek
  }

}());