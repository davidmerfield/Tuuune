Tuuune.discover = (function () {

  var Song = include('Song'),
      SongList = include('SongList'),
      filter = include('filter'),

      storage = include('storage'),
            
      allSongs = new SongList, 

      // songs which pass the filter
      results = new SongList, 
      minResults = 40, 

      // default search preferences
      options = {
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

    // Load options from disk
    options = storage.get('discover:options') || options;

  };

  function show () {


    // Show the DOM el and bind its event handlers
    $('#discover')
      .on('change', '.option', updateOption)
      .on('click', '#resetResults', reset)
      .on('click', '#loadMore', loadMore)
      .on('click', '.song', results, Song.listener)
      .show();

    // Render any songs which we've already fetched
    render(results);
    
    // Find new songs
    search();

  };

  function hide () {
    $('#discover')
      .off()
      .hide()
      .find('#results')
        .empty();
  };

  // This is used to find songs from the web
  // it calls itself recursively until it finds enough results

  function findSongs (callback) {

    if (results.length > minResults) {
      return callback('Song search complete');
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
        results.add(newFilteredSongs);

        // Render new songs which pass the filter
        render(newFilteredSongs);

        // We have heard from all the sources
        if (searchedSources.length === sources.length) {
          return findSongs(callback);
        };

      });

    };
  }; 

  function setOption () {

    var name = $(this).attr('name');
        $(this).val(options[name]);
    
  };

  function optionChange () {

    var name = $(this).attr('name');
        options[name] = parseInt($(this).val()) || $(this).val();

    storage.set('discover:options', options);

    results.set(filter(allSongs, options));

    $('#results')
      .empty()
      .html(results.render());

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
    return results.length > minResults;
  };

  function reset () {
    results = new SongList;
    return init();
  };

  function loadMore (e) {
    minResults += minResults;
    return search();
  };

  return {init: init, hide: hide}

}());