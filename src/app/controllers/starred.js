var starred = (function(){
   
  var viewId = 'starred',

      starredSongs = new SongList,
      
      // Used to store unstarred songs
      cache = new SongList,
      
      storageKey = 'musicFinder:starred',

      exports = {
         init: init,
         hide: hide,
         star: star,
         unstar: unstar,
         savedSongs: savedSongs,
         cache: cache
      };

  function init () {

    starredSongs.add(savedSongs());

     // Make the view visible
     $('#' + viewId).show();

     // Ensure the controller listens to the UI
     bindEventHandlers();

     // Render starred songs
     render();  

   };

  function hide () {

    $('#' + viewId).hide();

    unbindEventHandlers();

    setSongs(starredSongs);
  };

  function reset() {
     localStorage.removeItem(storageKey);
  };

  function bindEventHandlers () {
    Song.addListener(viewId, starredSongs);
  };

  function unbindEventHandlers () {   
    Song.removeListener(viewId);
  };
  
  function isStarred (id) {
    return starredSongs.find(id)
  };

  function star (song) {

    song.isStarred = true;

    // this should be instantiated
    starredSongs.add(savedSongs());
    // previously this was getting called and overwriting saved songs

    starredSongs.unshift(song);

    setSongs(starredSongs);
  };

  function unstar (song) {

    song.isStarred = false;

    // remove the repetition here
    starredSongs.add(savedSongs());

    starredSongs.remove(song.id);

    // In case the user restars an unstarred song
    cache.unshift(song);

    setSongs(starredSongs);
  };

  function savedSongs () {

    var songs = localStorage.getItem(storageKey);

    if (songs) {
      return new SongList(JSON.parse(songs));
    } else {
      return new SongList([])
    };
  };

  function setSongs (songs) {
    return localStorage.setItem(storageKey, JSON.stringify(songs));
  };

  function getStats () {

    var youtubeStats = {
          'Total songs': 0,
          'Total likes': 0,
          'Total dislikes': 0,  
          'Total listens': 0
        };

    for (var i = 0;i < starredSongs.length;i++) {
      
      var song = starredSongs[i];

      if (song.source.name) {

        youtubeStats['Total songs']++;
        youtubeStats['Total likes'] += song.popularity.likes;
        youtubeStats['Total dislikes'] += song.popularity.dislikes;
        youtubeStats['Total listens'] += song.listens;

      };

    };

    youtubeStats['Mean likes'] = youtubeStats['Total likes']/youtubeStats['Total songs'];
    youtubeStats['Mean listens'] = youtubeStats['Total listens']/youtubeStats['Total songs'];
    youtubeStats['Mean dislikes/likes'] = youtubeStats['Total dislikes']/youtubeStats['Total likes'];
    youtubeStats['Mean reactions/listens'] = (youtubeStats['Total likes'] + youtubeStats['Total dislikes'])/youtubeStats['Total listens'];

    return youtubeStats
  };

  function makeStatsHtml (stats) {
    var html = '';
    for (var i in stats) {
      html += '<p><b>' + i + ':</b> ' + stats[i] + '</p>';
    };
    return html
  };

  function render() {

    songsHTML = starredSongs.render();
    $('#' + viewId + ' .songList').html(songsHTML);

    statsHTML = makeStatsHtml(getStats());
    $('#' + viewId + ' .listStats').html(statsHTML);
  };

  return exports

}());