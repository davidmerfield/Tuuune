var discover = {

   init: function() {
      
      // Load the options used to discover songs
      this.setOptions(true);

      // Listen to changes to options inputs
      this.addOptionsListener();

      // Find songs
      this.findSongs();

   },

   allSongs: [], // Will contain all the songs we retrieve
   
   results: [], // Will contain all the songs which pass the filter

   findSongs: function(options) {

      if (!options) {
         var options = this.getOptions('search');
         
         var dateRange = helper.makeDateRange();

         options.publishedAfter = dateRange.after;
         options.publishedBefore = dateRange.before;
      }
      
      youtube.fetchVideos(options, function(response, pageToken){

         // Set songs
         discover.allSongs = discover.allSongs.concat(response); 

         // Filter songs
         discover.results = discover.filter(discover.allSongs);

         var resultsCount = discover.results.length,
             minResults = 3,
             maxResults = 10;

         if (resultsCount > maxResults) {
             return discover.render('complete')
         }

         // Set page token to retrieve next set of videos
         if (pageToken !== undefined) {
            options.pageToken = pageToken;            
         } else {
            options = null
         }
         
         if (resultsCount < minResults) {
            discover.findSongs(options);            
            return discover.render('empty');
         } else {
            discover.findSongs(options);
            player.init();            
            return discover.render('searching')            
         }

      });
   },

   filter: function(songs) {

      var options = this.getOptions('filter'),
          results = [];

      options.maxDuration = 7200;
      options.minDuration = 120;

      var bannedWords = [ 'live', 'choir', 'monologue', 'band', 'best of', 'barbershop', 'recording', 'song', 'orchestra', 'backstage', 'parody', 'making of', 'rehearsal', 'acoustic', 'tour', 'part', 'lesson', 'tabs', 'tutorial', 'theme', 'kickstarter', 'session', 'hd', 'blog', 'vlog', '@', '#', 'concert', 'music production', 'beat making', 'interview', 'soundtrack', 'instrumental', 'ost', 'episode', 'ep.', 'review' ];

      if (options.category !== 'album') {
         bannedWords.push('album', 'full album', 'remixxx', 'remixed');
         options.maxDuration = 720; // only songs up to 12 min in duration
      }

      if (options.category !== 'song') {
         options.minDuration = 720 // only albums more than 12 min in duration
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

        // Check video has enough likes
        if (likes / listens < options.likestoListens){
          continue
        }

        // skip banned words
        if (helper.hasBanned(song.snippet.title, bannedWords)) {
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
   },

   options: {},

   setOptions: function(defaultValues){
      
      var searchDefaults = {
         topicID: '/m/074ft', // all songs
         regionCode: 'US'
      },

      filterDefaults = {
         likestoListens: 0.01, // ratio of likes to views
         dislikesToLikes: 0.01, // ratio of likes to dislikes
         minListens: 500,
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
         this.options.search = helper.duplicate(searchDefaults);
         this.options.filter = helper.duplicate(filterDefaults);
      };
      
   },

   getOptions: function(category, defaultValues) {

      if (category === 'search') {
         return this.options.search
      };

      if (category === 'filter') {
         return this.options.filter
      };
      
      // All the options!
      return {
         search: this.options.search,
         filter: this.options.filter
      };

   },

   addOptionsListener: function() {

      $('.option').on('change', function(){

         console.log('options changed!!!!');

         var name = $(this).attr('id'),
             category = $(this).attr('category');
         
         if (name === 'maxListens') {
            discover.options.filter.maxListens = parseInt($(this).val())
         } else {
            discover.options[category][name] = $(this).val();
         }

         if (category == 'search') {
           discover.results = [];
           discover.allSongs = [];

           discover.render('empty');
           
           return discover.findSongs()
         }
         // refilter and rerender with new options
         discover.results = discover.filter(discover.allSongs);
         discover.render('done')

         if (discover.results.length < 10) {
            discover.findSongs()
         }

      });
   },

   removeOptionsListener: function() {
      $('.option').unbind('on');
   },

   setOptionsVals: function(){
      $('.option').each(function(){

         var name = $(this).attr('id'),
             category = $(this).attr('category');

         $(this).val(discover.options[category][name])

      });
   },

   removeSongByID: function (id) {
      for (var i in this.results) {
         var song = this.results[i];
         if (song.id && song.id === id) {
            return this.results = this.results.splice(i,1)
         }
      };      
   },

   getSongByID: function (id) {
      for (var i in this.results) {
         var song = this.results[i];
         if (song.id && song.id === id) {
            return song
         }
      }
   },

   setClickhandlers: function () {
      
      $('#results').on('click', '.result', function(){

         var id = $(this).attr('id'),
             song = discover.getSongByID(id);

         player.play(song);

      })

      $('#results').on('click', '.addToQueue', function(e){
         e.preventDefault(); // stops click event bubbling to .result

         var id = $(this).attr('id'),
             song = discover.getSongByID(id);

         player.addToQueue(song);

      });

      $('#results').on('click', '.removeFromResults', function(e){
         e.preventDefault(); // stops click event bubbling to .result

         var results = $(this).parentsUntil('.result');
             id = result.attr('id');

         discover.removeSongByID(id);

      });
   },

   resultTemplate: 
     '<a class="result" href="#" id="{{id}}">' +
       '<span class="thumbnail"><img src="{{snippet.thumbnails.default.url}}" /></span>' +
       '<span class="title">{{prettyTitle}} </span> ' +
       '<span class="buttons">' +
         '<span class="removeFromResults">x Hide</span>' +
         '<span class="addToQueue">+ Queue</span>' +
       '</span>' + 
       '<span class="stats">' +
         '<span class="duration">{{prettyDuration}} &#8226; </span>' +
         '<span class="views">{{prettyViewCount}} listens</span>' +
       '</span>' +
     '</a>',

   render: function(classname) {

      // if songs by the same artist are returned, shuffle their location
      // easiest way to do this would be to check the uplaoder
      $('#results').attr('class', classname);

      var html = '';

      for (var i in this.results) {
        var song =  this.results[i];
        html += Mustache.render(discover.resultTemplate, song);
      };

      $('#results').html(html);

   }

};