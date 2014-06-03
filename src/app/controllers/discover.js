var discover =  (function () {

  var viewId = 'discover',
      results,

      filteredSongs = new SongList,
      // Contains all the songs which pass the user's filter

      allSongs = new SongList,
      // Contains all the songs retrieved from the web

      options = options || {
        regionCode: 'US', // used to ensure songs are playable by user
        minResults: 10, 
        topicID: '/m/074ft', // all songs
        minListens: 0,
        maxListens: 100000,
        maxDuration: 840000,
        minDuration: 60000,
        exclude: {
           foreign: true,
           covers: true,
           remixes: true,
        }
      },

      // These contain methods we want to expose
      exports = {
        init: init,
        hide: hide
      };
      
  function init () {

    // Make the view visible
    $('#' + viewId).show();

    // Ensure the controller listens to the UI
    bindEventHandlers();

    // Used to hold the songs
    results = document.getElementById('results');
    
    // Render any songs which we've already fetched
    render(filteredSongs, true);
    
    // Hide the button which allows you to get more songs
    $('#loadMore').hide();    
  
    // Find songs to populate the view
    searchForSongs(function(message){
    
      // Show the button to get more songs
      $('#loadMore').show();
      
      console.log(message);
    });
  };

  function hide () {

    // Make the view invisible
    $('#' + viewId).hide();

    // Stop listening to click events in the view
    unbindEventHandlers();
  };

  function reset () {
    filteredSongs = new SongList;
    init();
  };

  function render (songs, reset) {

    // Remove existing songs from the results div
    if (reset) {results.innerHTML = ''};

    if (haveEnoughSongs()) {results.className = 'done'};

    var songs = new SongList(songs),
        songsHTML = songs.render();
    
    results.insertAdjacentHTML('beforeend', songsHTML);

  };

  // This is used to find songs from the web
  // it calls itself recursively until its found enough songs
  // which pass the filter

  function searchForSongs (callback) {

    if (haveEnoughSongs()) {
      return callback('We have enough songs');
    };

    var sources = [youtubeSearch, soundcloudSearch], // references to the modules //soundcloud is disabled
        searchedSources = [];

    // go through each source and 
    for (var i in sources) {
      
      var source = sources[i]; // e.g. youtube
      
      // Find songs from this source
      source.getSongs(options, function(newSongs){

        // Indicate that the source has replied
        searchedSources.push(source);

        // Add new songs to list of all songs
        allSongs.add(newSongs);
        
        // Find the new songs which pass the filter
        var newFilteredSongs = filter(newSongs, options);

        // Add the new songs which pass the filter to the list of filtered songs
        filteredSongs.add(newFilteredSongs);

        // Render new songs which pass the filter
        render(newFilteredSongs);

        // We have heard from all the sources
        if (searchedSources.length === sources.length) {
          return searchForSongs(callback);
        };

      });

    };
  }; 

  function bindEventHandlers () {

    $('#loadMore').on('click', loadMore);
    $('.option').on('change', setOptions);     

    $('#resetResults').on('click', reset);

    // Listen to songs
    Song.addListener(viewId, filteredSongs);

    $('#' + viewId).on('removeSong', function(e, data){
      allSongs.remove(data.id);
    });

  };

  function unbindEventHandlers () {
    $('#loadMore').off();
    $('.option').off();

    // 
    Song.removeListener(viewId)

  };

  function haveEnoughSongs() {
    return filteredSongs.length > options.minResults;
  };

  function loadMore (e) {
  
    options.minResults += 10;
    
    // Hide the button which allows you to get more songs
    $('#loadMore').hide();    
    
    // Find songs to populate the view
    searchForSongs(function(message){
    
      // Show the button to get more songs
      $('#loadMore').show();
      
      console.log(message);
    
    });

    return false

  };

  function setOptions () {

    var name = $(this).attr('id');

    if (name === 'maxListens') {
       options.maxListens = parseInt($(this).val())
    } else {
       options[name] = $(this).val();
    }

    filteredSongs.set(filter(allSongs, options));

    render(filteredSongs, true);

    // Hide the button which allows you to get more songs
    $('#loadMore').hide();    

    // Find songs to populate the view
    searchForSongs(function(message){
    
      // Show the button to get more songs
      $('#loadMore').show();

      console.log(message);
    
    });

  };

  return exports
}());