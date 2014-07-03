Tuuune.discover = (function () {

  var filter = include('filter'),
      Song = include('Song'),
      SongList = include('SongList'),

      // Contains all the songs retrieved from the web
      allSongs = new SongList,

      // Contains all the songs which pass the user's filter
      filteredSongs = new SongList,
      
      minResults = 40,

      options = options || {
        regionCode: 'US', // used to ensure songs are playable by user
        topicID: '/m/074ft', // all songs
        minListens: 2500,
        maxListens: 100000,
        maxDuration: 840000,
        minDuration: 60000,
        exclude: {
           foreign: true,
           covers: true,
           remixes: true,
        }
      };

  function init () {

    // Show the DOM el and bind its event handlers
    $('#discover')
      .show()
      .on('click', '#resetResults', reset)
      .on('click', '#loadMore', loadMore)
      .on('change', '.option', updateOption)      
      .on('click', '.song button', function(e){
        Song.eventHandler(this, filteredSongs)
      });
    
    // Render any songs which we've already fetched
    render(filteredSongs);
    
    // Find new songs
    search();

  };

  // This is used to find songs from the web
  // it calls itself recursively until its found enough songs 
  // which pass the filter

  function findSongs (callback) {

    if (haveEnoughSongs()) {
      return callback('We have enough songs');
    };

    var sources = [youtubeSearch, soundcloudSearch], // references to the modules , 
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
          return findSongs(callback);
        };

      });

    };
  }; 

  function updateOption () {

    var name = $(this).attr('name');
        options[name] = parseInt($(this).val()) || $(this).val();

    filteredSongs.set(filter(allSongs, options));

    $('#results').empty();

    render(filteredSongs);

    return search();
  };

  function search () {

    // Hide the button which allows you to get more songs
    $('#loadMore').hide();    

    // Find songs to populate the view
    findSongs(function(status){
    
      // Show the button to get more songs
      $('#loadMore').show();
    
    });

  };

  function render (songs) {

    var songs = new SongList(songs),
        songsHTML = songs.render();
    
    $('#results').append(songsHTML);

    if (haveEnoughSongs()) {
      $('#results').attr('class', 'done')
    };

  };

  function haveEnoughSongs() {
    return filteredSongs.length > minResults;
  };

  function hide () {
    return $('#discover')
      .off()
      .hide()
      .find('#results')
        .empty();
  };

  function reset () {
    filteredSongs = new SongList;
    return init();
  };

  function loadMore (e) {
    minResults += minResults;
    return search();
  };

  return {init: init, hide: hide}

}());