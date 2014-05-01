var discover =  function () {

  var allSongs = [], // Will contain all the songs we retrieve
  
      filteredSongs = [], // Will contain all the songs which pass the filter
      
      sources = [youtube], // references to the modules
      
      options = {},
      
      searchOptions = {

      },

      minResults = 20;

  function searchForSongs (callback) {

    var searchedSources = []; // contains list of sources which have responded

    // go through each source and 
    for (var i in sources) {
      
      var source = sources[i]; // e.g. youtube
      
      // Find songs from this source
      source().getSongs(searchOptions, function(songs){
        
        // append new songs to list of every song retrieved
        allSongs = addNew(songs).to(allSongs);
        
        // refilter results
        filteredSongs = filter(allSongs);

        // Render filtered results
        render('');

        // Add current source to list of sources which have replied
        searchedSources.push(source);

        // If all sources replied
        if (searchedSources.length === sources.length) {
          searchComplete();
        }

      });

    };

    function searchComplete () {

      // Determine if we need to keep searching
      if (filteredSongs.length < minResults) {
        return searchForSongs(callback)
      } 

      return callback('Search complete') 

    };    

  }

  function filter (songs) {

     var options = this.getOptions('filter'),
         results = [];

     options.maxDuration = 7200;
     options.minDuration = 60;

     var bannedWords = [ 'live', 'choir', 'monologue', 'band', 'best of', 'barbershop', 'recording', 'song', 'music', 'orchestra', 'backstage', 'parody', 'making of', 'rehearsal', 'acoustic', 'tour', 'part', '@', '#', 'lesson', 'tabs', 'tutorial', 'theme', 'kickstarter', 'session', 'hd', 'blog', 'vlog', 'concert', 'interview', 'soundtrack', 'instrumental', 'episode', 'ep.', 'review' ];

     if (options.category !== 'album') {
        bannedWords.push('album', 'full album', 'remixxx', 'remixed', 'remake');
        options.maxDuration = 720; // only songs up to 12 min in duration
     }

     if (options.category !== 'song') {
        options.minDuration = 1442 // only albums more than 24 min in duration
     }

     if (options.exclude.covers) {
        bannedWords.push('cover', 'covered', 'covers', 'tribute')
     }

     if (options.exclude.remixes) {
        bannedWords.push('remix', 'remixx', 'remixxx', 'remixed')
     }

     if (options.exclude.foreign) {
        var nonEnglish = new RegExp("[^\x00-\x7F]+");
     }

     for (var i in songs) {
       

       var song = songs[i],
           listens = song.statistics.viewCount,
           dislikes = song.statistics.dislikeCount,
           likes = song.statistics.likeCount;

        song.duration = helper.parseYTDuration(song.contentDetails.duration);

       // Check if video has too few or too many views 
       if (listens > options.maxListens ||
           listens < options.minListens) {
         continue
       }

       // Check if video is well liked
       if (dislikes / likes > options.dislikesToLikes) {
         continue
       } 

       // ignore non english songs
       if(nonEnglish && nonEnglish.test(song.snippet.title)) {
         continue
       }

       // disallow duplicates
       for (var j in results) {
         if (results[j].id === song.id) {
           continue
         }
       }

       // Check video has enough likes
       if (likes / listens < options.likestoListens){
         continue
       }

       // skip banned words
       if (helper.hasBanned(song.snippet.title, bannedWords)) {
         continue
       }

       // probably not a song
       if (song.snippet.title.indexOf(' - ') === -1 &&
           song.snippet.title.indexOf(' by ') === -1) {
         continue
       }

       // Ignore too short or too long videos
       if (song.duration < options.minDuration ||
           song.duration > options.maxDuration)  {
         continue
       };
       
       // Tidy up title string      
       song.prettyTitle = helper.tidyTitle(song.snippet.title);

       // Probably not great
       if (song.prettyTitle.length > 75) {
         continue
       }

       // Make pretty duration
       var mins = Math.floor(song.duration / 60),
           seconds = helper.pad(Math.floor(song.duration % 60),2);
        
       song.prettyDuration = mins + ':' + seconds;

       // Make pretty viewcount
       song.prettyViewCount = Math.round(listens/1000) + 'k';
       
       // passed tests, add to queue
       results.push(song);        

     };

     return results
  }; 

  function setOptions (defaultValues) {
     
     var searchDefaults = {
        // topicID: '/m/074ft', // all songs
        regionCode: 'US'
     },

     filterDefaults = {
        likestoListens: 0.015, // ratio of likes to views
        dislikesToLikes: 0.01, // ratio of likes to dislikes
        minListens: 1000,
        maxListens: 100000,
        category: 'song',
        exclude: {
           foreign: true,
           covers: true,
           remixes: true,
        }
     };

     // If we want defaults or if no options have been set yet
     if (defaultValues) {
        
        // Clone default properties, a reference would cause issues
        options.search = helper.duplicate(searchDefaults);
        options.filter = helper.duplicate(filterDefaults);
     };
     
  };

  function getOptions (category, defaultValues) {

     if (category === 'search') {
        return options.search
     };

     if (category === 'filter') {
        return options.filter
     };
     
     // All the options!
     return {
        search: options.search,
        filter: options.filter
     };

  };   

  function addOptionsListener () {

     $('.option').on('change', function(){

        console.log('options changed!!!!');

        var name = $(this).attr('id'),
            category = $(this).attr('category');
        
        if (name === 'maxListens') {
           options.filter.maxListens = parseInt($(this).val())
        } else {
           options[category][name] = $(this).val();
        }

        if (category == 'search') {
          results = [];
          allSongs = [];

          render('empty');
          
          return findSongs()
        }
        // refilter and rerender with new options
        results = filter(allSongs);
        render('done')

        if (results.length < 10) {
           findSongs()
        }

     });
  };

  function removeOptionsListener () {
     $('.option').unbind('on');
  };

  function setOptionsVals () {
     $('.option').each(function(){

        var name = $(this).attr('id'),
            category = $(this).attr('category');

        $(this).val(discover.options[category][name])

     });
  };

  function removeSongByID (id) {
     for (var i in results) {
        var song = results[i];
        if (song.id && song.id === id) {
           return results = results.splice(i,1)
        }
     };      
  };

  function getSongByID (id) {
     for (var i in results) {
        var song = results[i];
        if (song.id && song.id === id) {
           return song
        }
     }
  };

  function setClickhandlers () {
     
     $('#results').on('click', '.result', function(){

        var id = $(this).attr('id'),
            song = getSongByID(id);

        player.play(song);

     })

     $('#results').on('click', '.addToQueue', function(e){
        e.preventDefault(); // stops click event bubbling to .result

        var id = $(this).attr('id'),
            song = getSongByID(id);

        player.addToQueue(song);

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

     for (var i in results) {
       var song =  results[i];
       html += Mustache.render(resultTemplate, song);
     };

     $('#results').html(html);

  };

  return {
    init: function () {
      
      // Load the options used to discover songs
      setOptions(true);

      // Listen to changes to options inputs
      addOptionsListener();

      // Find songs
      findSongs();

    },

  }
};