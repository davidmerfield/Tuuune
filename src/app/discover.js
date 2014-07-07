Tuuune.discover = (function () {

  var Song = include('Song'),
      SongList = include('SongList'),
      filter = include('filter'),

      storage = include('storage'),
            
      allSongs = new SongList, 
      results = new SongList,  // songs which pass the filter

      pageSize = minResults = 40, 

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
      .on('change', '.option', optionChange)
      .on('click', '#resetResults', reset)
      .on('click', '#loadMore', loadMore)
      .on('click', '.song', results, Song.listener)
      .show()
      .find('.option')
        .each(setOption);

    $('#results').html(results.render());

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

    var sources = [youtubeSearch, soundcloudSearch], // references to the modules , 
        searchedSources = [],
        source;

    // We've found enough songs
    if (results.length > minResults) {return callback()};

    // go through each source and 
    for (var i in sources) {
      
      source = sources[i]; // e.g. youtube
      
      // Find songs from this source
      source.getSongs(options, function(newSongs){

        var newResults,
            starred = include('starred'),
            songHistory = include('songHistory');

        newSongs = new SongList(newSongs);
            
        // Ignore songs we've already seen
        newSongs
          .exclude(allSongs)
          .exclude(starred.songs)
          .exclude(songHistory.songs);

        allSongs.add(newSongs);

        // Filter new songs
        newResults = new SongList(filter(newSongs, options));
        
        results.add(newResults);

        $('#results').append(newResults.render());

        // Indicate that the source has replied
        searchedSources.push(source);

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

  function reset () {

    // Remove any songs we've found
    results = new SongList;
    $('#results').empty();

    return search();
  };

  function loadMore (e) {

    // Increase the threshold after which to stop searching
    minResults += pageSize;

    return search();
  };

  return {init: init, hide: hide, show: show}

}());