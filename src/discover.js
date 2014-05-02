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

    console.log('FILTER: TOTAL SONGS: ' + songs.length);

     var options = getOptions('filter'),
         results = [];

     options.maxDuration = 7200;
     options.minDuration = 60;

     var bannedWords = [
      'live', 'radio', 'choir', 'medley', 'monologue',
      'university', 'college', 'encore', 'duet',
      'moshcam', 'premiere', 'dvd', 'Eurovision', 'sxsw',
      'improv', 'TEDx', 'band', 'hd', 'quartet', 'choral', 'chorale',
      'concerto', 'requiem', 'improvisation', 'semifinal', 'recital',
      'festival', 'suite', 'idol', 'contest', 'Q&A', 'middle school',
      'high school', 'capella', 'a cappella', 'bonaroo', 'subscribers',
      'octet', 'best of', 'barbershop', 'recording', 'song',
      'music', 'orchestra', 'backstage', 'behind the scenes', 'parody', 'making of',
      'w/', 'rehearsal', 'acoustic', 'tour', 'part', '@', '#',
      'violin', 'piano', 'hall of fame', 'documentary',
      'awards', 'music theory', 'arrangement',
      'lesson', 'tabs', 'tutorial', 'theme', 'kickstarter', 'session',
      'blog', 'vlog', 'concert', 'concierto', 'interview', 'soundtrack',
      'chord changes', 'instrumental', 'episode', 'performance',
      'letterman', 'jimmy kimmel', 'jonathan ross', 'me singing',
      'me covering', 'guitar tab', 'performed by',
      'dubstep', 'jazz', 'rap', 'hiphop', 'anthem',
      'version', 'ep.', 'op.', 'no.', 'review', '.wmv',
      '.mov', '.avi', '.mp3', '.mpg', 'at the', 'OST'
      ];

     bannedWords.push(
      'Justin Bieber', 'One Direction', 'Michael Jackson', 'Temper Trap',
       'dean martin', 'justin timberlake', 'cee lo green', 'josh groban',
       'britney spears', 'modest mouse', 'elton john', 'bob dylan', 'don mclean',
       'katy perry', 'johnny cash', 'snow patrol', 'nickleback', 'idina menzel',
       'timbaland', 'ingrid michaelson', 'shakira', 'lana del rey', 'alabama shakes',
       'radiohead', 'paloma faith', 'the ramones', 'snoop dogg', 'bach', 'the shins',
       'fleet foxes', 'led zeppelin', 'taio cruz', 'birdy', 'paolo nutini', 'willie nelson',
       'iron maiden', 'Guns N\' Roses', 'guns n roses', 'tom waits', 'REM', 'R.E.M',
       'R. Kelly', 'R.Kelly', 'bon iver', 'sinead o connor', 'norah jones',
       'red hot chilli peppers', 'paul mcartney', 'taylor swift', 'jason derulo',
       'billy bragg', 'miley cyrus', 'p!nk', 'modest mouse', 'wu tang clan',
       'macklemore', 'queens of the stone age', 'the kinks', 'jimi hendrix',
       'twisted sister', '2pac', 'bjork', 'enya', 'jethro tull', 'mariah carey',
       'lupe fiasco', 'my chemical romance', 'the beatles', 'maroon 5', 'carly rae jepsen',
       'the wanted', 'david bowie', 'rod stewart', 'rolling stones', 'skrillex', 'cher lloyd'
     );

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
       if (song.snippet.title.indexOf('#') > -1 ||
           song.snippet.title.indexOf('@') > -1 ) {
         continue
       }

       // probably not a song
       if (song.snippet.title.indexOf(' - ') === -1) {
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

     console.log('PASSED SONGS: ' + results.length);

     return results
  }; 

  function setOptions (defaultValues) {
     
     var searchDefaults = {
        // topicID: '/m/074ft', // all songs
        regionCode: 'US'
     },

     filterDefaults = {
        likestoListens: 0.0025, // ratio of likes to views
        dislikesToLikes: 0.075, // ratio of likes to dislikes
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
          filteredSongs = [];
          allSongs = [];

          render('empty');
          
          return findSongs()
        }
        // refilter and rerender with new options
        filteredSongs = filter(allSongs);
        render('done')

        if (filteredSongs.length < 10) {
           searchForSongs()
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
     for (var i in allSongs) {
        var song = allSongs[i];
        if (song.id && song.id === id) {
           return allSongs = allSongs.splice(i,1);
        }
     };      
  };

  function getSongByID (id) {
     for (var i in allSongs) {
        var song = allSongs[i];
        if (song.id && song.id === id) {
           return song
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

     for (var i in filteredSongs) {
       var song =  filteredSongs[i];
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
      searchForSongs(function(message){
        console.log(message);
      });

    },

  }
};