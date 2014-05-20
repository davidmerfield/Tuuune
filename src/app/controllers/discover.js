var discover =  (function () {

  var viewId = 'discover',

      allSongs = allSongs || [], 
      // Contains all the songs retrieved from the web

      filteredSongs = [],
      // Contains all the songs which pass the current filter
      
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
    
    // in future perhaps build
    // the view at this point

    show();
    
  };

  function show () {

    // Make the view visible
    $('#' + viewId).show();

    // Ensure the controller listens to the UI
    bindEventHandlers();

    // Determine whether or not to search for songs
    if (needMoreSongs()) {

      searchForSongs(function(message){console.log(message)});
    };
  };

  function hide () {

    $('#' + viewId).hide();

    unbindEventHandlers();

  };

  function render (classname) {
    
    console.log(filteredSongs);
    
    results.setAttribute('class', '');
    
    var html = '';
    
    for (var i in filteredSongs) {
      var song = filteredSongs[i];
      html += Song.render(song);
    }

    results.innerHTML = html;

  };

  function bindEventHandlers () {

    $(Song).on('playSong', playSong);
    $(Song).on('queueSong', queueSong);
    $(Song).on('removeSong', removeSong);
    $(Song).on('starSong', starSong);

    $('#loadMore').on('click', loadMore);

    $('.option').on('change', setOptions);     

  };

  function unbindEventHandlers () {
    
    $(Song).off();
    
    $('#loadMore').off();

    $('.option').off();
  };

  function searchForSongs (callback) {

    var sources = [youtube, soundcloud], // references to the modules
        searchedSources = []; // will contain list of sources which have responded

    // go through each source and 
    for (var i in sources) {
      
      var source = sources[i]; // e.g. youtube
      
      // Find songs from this source
      source().getSongs(options, function(songs){

        // Indicate this source has responded
        searchedSources.push(source);
        
        // Add news songs to auto queue
        player.addToAutoQueue(filter(songs, options));

        // append new songs to list of every song retrieved
        allSongs = Song.add(songs, allSongs);
        
        // refilter all songs
        filteredSongs = filter(allSongs, options);

        // Re-render new results
        render();

        // When all sources have replied
        if (searchedSources.length === sources.length) {
          return searchComplete();
        }

      });

    };

    function searchComplete () {

      // Determine if we need to keep searching
      if (needMoreSongs()) {
        return searchForSongs(callback)
      } 

      $('#loadMore').show();

      return callback('Found ' + filteredSongs.length + ' songs!') 

    };    

  }; 

  function playSong (e, data) {

    var song = Song.get(data.id, filteredSongs),
        defaultQueue = Song.getSongsAfter(song, filteredSongs);

    player.play(song, defaultQueue);

  }; 

  function queueSong (e, data) {
    
    var song = Song.get(data.id, filteredSongs);

    player.addToQueue('user', song);

  };

  function removeSong (e, data) {
    
    Song.drop(data.id, allSongs);

    filteredSongs = filter(allSongs, options);

  };

  function starSong (e, data) {
    
    var song = Song.get(data.id, filteredSongs);

    if (song.isStarred) {
      starred.unstar(song);
    } else {
      starred.star(song);
    };

  };

  function loadMore () {
    options.minResults += 10;

    $(this).hide();

    searchForSongs(function(message){console.log(message)});        

  };

  function setOptions () {

    var name = $(this).attr('id');

    if (name === 'maxListens') {
       options.maxListens = parseInt($(this).val())
    } else {
       options[name] = $(this).val();
    }

    // refilter and rerender with new options
    filteredSongs = filter(allSongs, options);

    if (needMoreSongs()) {
      render('searching');
      searchForSongs(function(response){
        render('done');
        console.log(response);
      });
    } else {
      render('done')
    }

  };

  function needMoreSongs () {
    return filteredSongs.length < options.minResults
  };

  return exports
}());