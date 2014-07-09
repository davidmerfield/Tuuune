Tuuune.queue = (function(){
   
   var  Song = include('Song'),
        SongList = include('SongList'),
        player = include('player'),

        // Contains the songs which will play next
        queue = {
          user: new SongList,
          auto: new SongList
        };

  function add (song) {
    queue.user.push(song);
    updateNav();
  };

  function set (songs) {
    queue.auto = songs;
  };

  function find (id) {
    return queue.user.find(id) || queue.auto.find(id)
  };

  function before (song) {

    // Check if the user has played any songs
    if (songHistory.length) {
      return songHistory[1]
    };

    // Allow the user to work up the song queue 
    var previousSongs = queue.auto.findBefore(song.id);

    if (previousSongs.length) {
      return previousSongs.pop()
    };

    return false

  };
  
  function updateNav () {
    if (queue.user.length) {
      $('.queueCount').text(queue.user.length);
    };
  };

  function after (song) {

    // Check if the user has queued any songs
    if (queue.user.length > 0) {
      var song = queue.user.shift();
          updateNav();
      return song
    }

    // this will return false if current song is removed from songlist
    var defaultQueue = queue.auto.findAfter(song.id);
    // check songHistory if this is the case, or go to start of songlist

    // Check if there are any songs which should auto play
    if (defaultQueue.length > 0) {
      return defaultQueue.shift()
    }

    return false
  };

  function init () {


   };

  function show () {

    $('#queue')
      .show()
      .on('click', '.song', Song.listener);

    $('#player')
      .on('songChange', function(){
        render();
      });

    render();

  };

  function hide () {
    $('#queue').off().hide();
    $('#player').off('songChange');
  };

  function render() {
    $('#queue .songList').html(queue.user.render());
  };

  return {
    init: init,
    hide: hide,
    show: show,
    
    add: add,
    set: set,
    find: find,

    after: after,
    before: before
  }

}());