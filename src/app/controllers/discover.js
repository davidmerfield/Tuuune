// I get lots of interesting architecture problems due to the slow nature of the search
// this could be greatly simplified if I only had to make one call to my server, which would
// return say 20 songs instantly.

var discover =  function (options, allSongs) {

  var allSongs = allSongs || [], // A list of the all the unique songs returned from search
      filteredSongs = [], // A subset of allSongs which passes the filter
          
      options = options || {
        regionCode: 'US', // used to ensure songs are playable by user
        minResults: 20, 
        topicID: '/m/074ft', // all songs
        likestoListens: 0.0025, // ratio of likes to views
        dislikesToLikes: 0.05, // ratio of likes to dislikes
        minListens: 1000,
        maxListens: 100000,
        maxDuration: 7200,
        minDuration: 60,
        category: 'song',
        exclude: {
           foreign: true,
           covers: true,
           remixes: true,
        }
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

      return callback('Found ' + filteredSongs.length + ' songs!') 

    };    

  }; 

  function removeSongByID (id) {
    for (var i in allSongs) {
        var song = allSongs[i];
        if (song.id && song.id === id) {
          allSongs = allSongs.splice(i,1);
          break 
        }
    };      
    for (var i in filteredSongs) {
       var song = filteredSongs[i];
       if (song.id && song.id === id) {
        filteredSongs = filteredSongs.splice(i,1);
         break 
       }
    }
  };

  function getSongsAfter(id) {

    for (var i in filteredSongs) {
       var song = filteredSongs[i];
       if (song.id && song.id === id) {
          return [song, filteredSongs.slice(i)]
       }
    }

  };

  function getSongByID (id) {
     for (var i in filteredSongs) {
        var song = filteredSongs[i];
        if (song.id && song.id === id) {
           return [song, filteredSongs.slice(i)]
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

    // the three below will get reused
     $('#results').on('click', '.result', function(){

        var id = $(this).attr('id'),
            song = getSongByID(id)[0],
            defaultQueue = getSongByID(id)[1];

        player.play(song);
        player.makeQueue(defaultQueue);
     })

     $('#results').on('click', '.addToQueue', function(e){
        e.preventDefault(); // stops click event bubbling to .result

        var id = $(this).attr('id'),
            song = getSongByID(id);

        player.addToQueue(song);

     });

     $('#results').on('click', '.star', function(e){
        e.preventDefault(); // stops click event bubbling to .result

        var id = $(this).attr('id'),
            starredSongsKey = appPrefix + ':starred',
            song = getSongByID(id);

        var starredSongs = JSON.parse(localStorage.get(savedSongsKey));
            starredSongs.unshift(id);

        localStorage.set(savedSongsKey, savedSongs);
        localStorage.set(id, song);

     });

     $('#results').on('click', '.removeFromResults', function(e){
        e.preventDefault(); // stops click event bubbling to .result

        var results = $(this).parentsUntil('.result');
            id = result.attr('id');

        removeSongByID(id);

     });
  };

  var resultTemplate = 
    '<a class="result" href="#" id="{{id}}">' +
      '<span class="thumbnail"><img src="{{snippet.thumbnails.default.url}}" /></span>' +
      '<span class="title">{{prettyTitle}} </span> ' +
      '<span class="buttons">' +
        '<span class="removeFromResults">x Hide</span>' +
        '<span class="star">* Star</span>' +
        '<span class="addToQueue">+ Queue</span>' +
      '</span>' + 
      '<span class="stats">' +
        '<span class="duration">{{prettyDuration}} &#8226; </span>' +
        '<span class="views">{{prettyViewCount}} listens &#8226; </span>' +
        '<span class="views">{{statistics.likeCount}} likes &#8226; </span>' +
        '<span class="views">{{statistics.dislikeCount}} dislikes</span>' +
      '</span>' +
    '</a>';

  function render (classname) {

     // if songs by the same artist are returned, shuffle their location
     // easiest way to do this would be to check the uplaoder
     $('#results').attr('class', classname);

     var html = '';

     for (var i in filteredSongs) {
       var song =  filteredSongs[i];
       html += Mustache.render(resultTemplate, song);
     };

     $('#results').html(html);

  };

  return {
    init: function () {
      
      // Listen to changes to options inputs
      addUIListener();

      // Find songs
      searchForSongs(function(message){
        console.log(message);
      });

    },
    detach: function() {
      $('.option').unbind('on');
    }

  }
};