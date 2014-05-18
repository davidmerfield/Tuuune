// This could be greatly simplified if I only had to make one call to my server, which would
// return say 20 songs instantly.

var discover =  (function () {

  var allSongs = allSongs || [], // A list of the all the unique songs returned from search
      filteredSongs = [], // A subset of allSongs which passes the filter
      
      results,

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

      exports = {
        init: init,
        hide: hide
      }
      
  function init () {
    
    $('#discover').show();

    results = document.getElementById('results');

    // Listen to changes to options inputs
    addUIListener();

    if (filteredSongs.length < options.minResults) {
      // Find songs
      searchForSongs(function(message){
        console.log(message);
      });      
    }

  };

  function hide () {
    $('#discover').hide();
    $('.option').unbind('on');
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
        allSongs = addNew(songs).to(allSongs);
        
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
      if (filteredSongs.length < options.minResults) {
        return searchForSongs(callback)
      } 

      $('#loadMore').show();

      return callback('Found ' + filteredSongs.length + ' songs!') 

    };    

  }; 

  function removeSongByID (id) {
    for (var i in allSongs) {
        var song = allSongs[i];
        if (song.id && song.id === id) {
          allSongs.splice(i,1);
          break 
        }
    };      
    for (var i in filteredSongs) {
       var song = filteredSongs[i];
       if (song.id && song.id === id) {
        filteredSongs.splice(i,1);
         break 
       }
    }
  };

  function lookupSong (id) {
     for (var i in filteredSongs) {

        var song = filteredSongs[i];

        if (song.id && song.id === id) {
          
          i++;

          var nextSongs = filteredSongs.slice(i);

          return {
            'song': song,
            'defaultQueue': nextSongs
          }

        }
     }
  };

  // Used to ensure no duplicatea are added to array
  function addNew (newArray) {

    return {
      to: function (oldArray) {
        
        if (newArray.length === 0) {return oldArray};

        var newItem = newArray.pop();

        for (var i in oldArray) {
          if (newItem.id === oldArray[i].id) {
            // ignore this item we have it already
            return addNew(newArray).to(oldArray)
          }
        }

        // item is unique, add it to old items
        oldArray.push(newItem);
        return addNew(newArray).to(oldArray)
  
      }
    }
  };

  function addUIListener () {

    $(document).on('playSong', function(e, data){
       
      var id = data.id;
          songInfo = lookupSong(id);
          song = songInfo.song,
          defaultQueue = songInfo.defaultQueue;

      player.play(song, defaultQueue);
       
    });

    $(document).on('queueSong', function(e, data){

      console.log(data.id);

      var id = data.id;
          songInfo = lookupSong(id);
          song = songInfo.song;

      player.addToQueue('user', song);
       
    });

    $(document).on('removeSong', function(e, data){
       
       removeSongByID(data.id);

      // removeSongByID(data.id);

    });

    $(document).on('starSong', function(e, data){

      var id = data.id;
          songInfo = lookupSong(id);
          song = songInfo.song;

       starred.star(song);

    });

    $('#loadMore').on('click', function(){
      options.minResults+=10;
      $(this).hide();
      searchForSongs(function(){

      });
    });

    $('.option').on('change', function(){

       var name = $(this).attr('id');

       if (name === 'maxListens') {
          options.maxListens = parseInt($(this).val())
       } else {
          options[name] = $(this).val();
       }

       // refilter and rerender with new options
       filteredSongs = filter(allSongs, options);

       if (filteredSongs.length < options.minResults) {
         render('searching');
         searchForSongs(function(response){
           render('done');
           console.log(response);
         });
       } else {
         render('done')
       }

    });     

  };

  function render (classname) {
    results.setAttribute('class', '');
    
    var html = '';
    
    for (var i in filteredSongs) {
      var song = filteredSongs[i];
      html += Song().render(song);
    }

    results.innerHTML = html;
  };

  return exports
}());