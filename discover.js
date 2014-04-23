$(function() {

   var util, discover, youtube, player;

   util = loadUtilities();

   discover = {

      allSongs: [], // Will contain all the songs we retrieve

      results: [], // Will contain all the songs which pass the filter

      filter: function(songs) {

         console.log(songs);

         // The filter is very heavy handed.
         // We have so many songs to choose
         // from we can afford to have lots
         // of false negatives. Whatever.

         var options = this.getUserOptions('filter'),
             options.maxDuration = 7200,
             options.minDuration = 120,
             results = [];
         
         var bannedWords = [ 'live', 'choir', 'monologue', 'band', 'recording', 'song', 'orchestra', 'backstage', 'parody', 'making of', 'rehearsal', 'acoustic', 'tour', 'part', 'lesson', 'tabs', 'tutorial', 'theme', 'kickstarter', 'session', 'hd', 'blog', 'vlog', '@', '#', 'concert', 'music production', 'beat making', 'interview', 'soundtrack', 'ost', 'episode', 'review' ];

         if (options.category !== 'album') {
            bannedWords.push('album', 'full album', 'remixxx', 'remixed');
            options.maxDuration = 720, // only songs up to 12 min in duration
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
           if (dislikes / likes > options.likeRatio) {
             continue
           } 

           // ignore non english songs
           if(nonEnglish && nonEnglish.test(song.snippet.title)) {
             continue
           }

           // Check video has enough likes
           if (likes / listens < options.likestoViews){
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
           song.snippet.title = helper.tidyTitle(song.snippet.title);

           // Make pretty duration
           var mins = Math.floor(song.duration / 60),
               seconds = util.pad(Math.floor(song.duration % 60),2);
            
            song.prettyDuration = mins + ':' + seconds;

           // Make pretty viewcount
           song.prettyViewCount = Math.round(listens/1000) + 'k';
           
           // passed tests, add to queue
           results.push(song);        
           
         };

         return results
      },

      // calls render() when done
      findSongs: function() {

         // Make sure options are updated
         var options = this.getUserOptions('search'),

             minResults = 5, // render results when this many are found
             maxResults = 15; // stop searching when this many are found

         youtube.fetchVideos(options, function(response){

            // Add response to list of all songs
            discover.allSongs = discover.allSongs.concat(response); 

            // Refilter all the songs we've found so far
            discover.results = discover.filter(discover.allSongs);

            // If we don't have enough songs which pass the filter...
            if (discover.results.length < minResults) {
               discover.render('searching');
               return discover.findSongs()
            };

            // We have enough to render first results but not to stop searching
            if (discover.results.length < maxResults) {
               discover.render('midSearch');
               return discover.findSongs();
            }

            // We've found enough
            return discover.render('done');

         });
      },

      ui: {

         init: function() {

         },

         getOptions: function() {


            var searchDefaults = {
               genre: '/m/074ft', // all songs
               count: 200,
               regionCode: 'US',
            },

            // Options for the song filter
            filterDefaults = {
               likestoViews: 0.01, // ratio of likes to views
               likeRatio: 0.01, // ratio of likes to dislikes
               minViews: 500,
               maxViews: 100000,
               category: 'song',
               exclude: {
                  foreign: true,
                  covers: true,
                  remixes: false,
               }
            };

            var searchOptions = {
               'regionCode': $('#regionCode').val(),
               'genre': $('#genre').val()
            };

            var filterOptions = {
               category: $('#category').val(),
               maxViews: parseInt($('#popularity').val()),
               exclude: {
                  covers: $('#covers').val(),
                  foreign: $('#foreign').val(),
                  remixes: $('#remixes').val()
               }
            };

            return {search: searchOptions, filter: filterOptions}

         }

      },

      render: function(state) {

         // if songs by the same artist are returned, shuffle their location
         // easiest way to do this would be to check the uplaoder

         
         var template =
           '<a class="result" href="#" id="{{id}}">' +
             '<span class="thumbnail"><img src="{{snippet.thumbnails.default.url}}" /></span>' +
             '<span class="title">{{snippet.title}} </span> ' +
             '<span class="buttons">' +
               '<span class="removeFromQueue">x Hide</span>' +
               '<span class="addToQueue">+ Queue</span>' +
             '</span>' + 
             '<span class="stats">' +
               '<span class="duration">{{prettyDuration}} &#8226; </span>' +
               '<span class="views">{{prettyViewCount}} listens</span>' +
             '</span>' +
           '</a>',
           html = '';

         for (var i in queue) {
           var video = queue[i];
           html += Mustache.render(template, video);
         };

         output.innerHTML = html;

         // should abstract the video loop through queue

         console.log(state);
         console.log(this.results);
      },

      userOptions: function(category) {

         ui.getOptions()
         
         if (category === 'filter') {
            return filterDefaults
         }

         if (category === 'search') {
            return searchDefaults
         }

         return true

         // check DOM for changes

         // if reset 

      }

   };

   youtube = {

      key: 'AIzaSyC_URB8fBLx2waLcJ29-8hlihfmz4Xlzn4',

      baseURL: 'https://www.googleapis.com/youtube/v3/',

      fetchVideos: function (options, callback) {

         var dateRange = util.makeDateRange();

         // Options for song finder
         var searchOptions = {
            topicID: options.genre,
            regionCode: options.regionCode,
            publishedAfter: dateRange.after,
            publishedBefore: dateRange.before
         };
            
         var response = [];

         getSomeVideos();

         function getSomeVideos(pageToken) {

            if (pageToken) {searchOptions['pageToken'] = pageToken};

            youtube.getVideoIDs(searchOptions, function(videoIDs, nextPage){

               youtube.getMetadata(videoIDs, function(results){
                  
                  response = response.concat(results);
                  
                  if (response.length < options.count)  {
                     return getSomeVideos(nextPage)
                  } 

                  return callback(response)
               });
            });
         };
      },

      getVideoIDs: function (options, callback) {

         var videoIDs = [], 
             params = {
               key: youtube.key,
               type: 'video',
               part: 'snippet', 
               videoEmbeddable: 'true',
               videoSyndicated: 'true', // means the embed is playable
               maxResults: '50', // max allowed by YouTube
               videoCategoryId: '10' // Is correct for 'US', 'GB', 'AU', 'FR', 'CA', 'DE', 'IT'
            }

         // Merge options with default params
         for (var i in options) {params[i] = options[i]};
         
         var queryUrl = youtube.makeURL('search', params);

         $.getJSON(queryUrl, function(searchResults, err) {
            
            if (err) {youtube.errorHandler(queryUrl, 'getVideoIDs', err)};
                       
            for (var i in searchResults.items) {
              var video = searchResults.items[i];
              videoIDs.push(video.id.videoId);
            };

            return callback(videoIDs, searchResults.nextPageToken);
           
         });


      },

      getMetadata: function (videoIDs, callback) {

         var params = {
               part: 'statistics,snippet,topicDetails,contentDetails',
               id: videoIDs,
               key: youtube.key
         };

         var queryUrl =  youtube.makeURL('videos', params)

         $.getJSON(queryUrl, function(metadata, err) {

            var results = [];

            if (err) {youtube.errorHandler(queryUrl, 'getMetadata', err)};

            for (var i in metadata.items) {
             results.push(metadata.items[i])
            }

            return callback(results)

         });
      },

      makeURL: function (query, params) {
        
        var url = '';

        for (key in params) {
          var param = params[key];
          if (typeof param == 'object'){
              param = param.join(',');
          };
          url += encodeURIComponent(key) + '=' + encodeURIComponent(param) + '\&'
        };

        return youtube.baseURL + query + '?' + url
      },

      errorHandler: function(method, query, err) {
         if (err !== 'success') {
            console.log('YT API ERRRRRRRRRRROR: ')
            console.log('Method: ' + method);
            console.log('Query URL: ');
            console.log(query);
            console.log('Error: ');
            console.log(err);
            console.log('-----------------------------: ')            
         } else {
            console.log('YT Api call succeeded: ' + query)
         }
      }

   };

   var helper = {
      hasBanned: function (string, phrases) {
        for (var i in phrases){
          var phrase = phrases[i];
              regex = new RegExp( '(' + ' ' + phrase + ')', 'gi' );
            if (regex.test(string)) {return true}
        }
        return false
      },
      tidyTitle: function (title) {
         
         title = title.replace(/ *\[[^)]*\] */g, "");

         var getParens = /\((.*?)\)/;

             title = removeBanned(title, [
               'official video',
               'official audio',
               'official music video',
               'music video',
               'unofficial music video',
               'audio stream',
               'new release',
               'studio version',
               'lyrics'
             ]);

             function removeBanned(string, phrases) {
               for (var i in phrases){
                 var phrase = phrases[i];
                     regex = new RegExp( '(' + ' ' + phrase + ')', 'gi' );
                 
                 string = string.replace(regex, " " );
               }
               return string
             }

             if (title.match(getParens)) {

               parensContent = title.match(getParens)[0];

               console.log(parensContent);

               if (parensContent.indexOf('remix') === -1 && parensContent.indexOf('Remix') === -1) {
                 title = title.replace(/ *\[[^)]*\] */g, "").replace(/ *\([^)]*\) */g, "");
               }

             }
             
             title = title.trim();
             
             title = title.replace(/"/g, '');

             while (title.substr(title.length - 1) === '-') {
               title = title.slice(0, - 1);
             }

         return title         
      },
      // Not mine
      parseYTDuration: function(duration) {
         var a = duration.match(/\d+/g);

         if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
             a = [0, a[0], 0];
         }

         if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
             a = [a[0], 0, a[1]];
         }
         if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
             a = [a[0], 0, 0];
         }

         duration = 0;

         if (a.length == 3) {
             duration = duration + parseInt(a[0]) * 3600;
             duration = duration + parseInt(a[1]) * 60;
             duration = duration + parseInt(a[2]);
         }

         if (a.length == 2) {
             duration = duration + parseInt(a[0]) * 60;
             duration = duration + parseInt(a[1]);
         }

         if (a.length == 1) {
             duration = duration + parseInt(a[0]);
         }
         return duration
      }      
   };

   discover.findSongs();
   
});
