Tuuune.discover = (function () {

  var Song = include('Song'),
      SongList = include('SongList'),

      filter = include('filter'),
      storage = include('storage'),
            
      allSongs = new SongList, 
      results = new SongList,  // songs which pass the filter

      pageSize = minResults = 20, 

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
    options = storage.get('discover:options') || options;
  };

  function show () {

    // Show the DOM el and bind its event handlers
    $('#discover')
      .show()
      .on('change', '.option', optionChange)
      .on('click', '#resetResults', reset)
      .on('click', '#loadMore', loadMore)
      .on('click', '.song', results, Song.listener);

    // Make sure each option control reflects the stored setting
    $('.option').each(setOption)

    // Populate the results div with any existing results
    $('#results').html(results.render());

    // Find new songs
    findSongs();
  };

  function hide () {
    $('#discover').off().hide();
    $('#results').empty();
  };

  // Find songs from the internet, calls itself recursively until
  // enough songs are found.
  function findSongs () {

    var sources = include('search'),
        searchedSources = 0,
        source;

    $('#loadMore').hide();    

    // We've found enough songs
    if (results.length > minResults) {
      return $('#loadMore').show()
    };

    // go through each source and 
    for (var i in sources) {
      
      source = sources[i]; // e.g. youtube
      
      // Find songs from this source
      source.getSongs(options, function(newSongs){

        var newResults,
            starred = include('starred'),
            songHistory = include('songHistory');

        newSongs = new SongList(newSongs);
            
        // Remove songs we've already seen
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
        searchedSources++;

        // We have heard from all the sources
        if (searchedSources === sources.length) {
          return findSongs();
        };
      });
    };
  }; 

  function optionChange () {

    var name = $(this).attr('name'),
        value = parseInt($(this).val()) || $(this).val();
    
    // Store the updated option
    options[name] = value;
    storage.set('discover:options', options);

    // Re-render search results to reflect this new preference
    results.set(filter(allSongs, options));
    $('#results').html(results.render());

    // Find new songs with new filter options
    return findSongs();
  };

  // Set the option value of a control
  function setOption () {
    var name = $(this).attr('name');
    $(this).val(options[name]);
  };

  // Remove any songs we've found and start a new search
  function reset () {
    results.empty();
    $('#results').empty();
    return findSongs();
  };

  // Increases the threshold after which to stop searching
  function loadMore (e) {
    minResults += pageSize;
    return findSongs();
  };

  return {init: init, hide: hide, show: show}
}());