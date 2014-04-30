var youtube = {

      key: 'AIzaSyC_URB8fBLx2waLcJ29-8hlihfmz4Xlzn4',

      baseURL: 'https://www.googleapis.com/youtube/v3/',
      
      fetchVideos: function (options, callback) {
        youtube.getVideoIDs(options, function(videoIDs, nextPage){
           youtube.getMetadata(videoIDs, function(response){
              return callback(response, nextPage)
           });
        });
      },

      getVideoIDs: function (options, callback) {

         var videoIDs = [], 
             params = {
               key: youtube.key,
               type: 'video',
               part: 'snippet', 
               order: 'title',
               videoEmbeddable: 'true',
               videoSyndicated: 'true', // means the embed is playable
               maxResults: '50', // max allowed by YouTube
               videoCategoryId: '10' // Is correct for 'US', 'GB', 'AU', 'FR', 'CA', 'DE', 'IT'
            }

         // Merge options with default params
         for (var i in options) {params[i] = options[i]};
         
         var queryUrl = youtube.makeURL('search', params);

        console.log(queryUrl);

        console.log(params.publishedAfter + ' is start date.');
        console.log(params.publishedBefore + ' is end date.');

         $.getJSON(queryUrl, function(searchResults, err) {
            
            if (err) {youtube.errorHandler(queryUrl, 'getVideoIDs', err)};
            
            console.log(searchResults);

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
              console.log(metadata.items[i]);
              
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
            // console.log('YT Api call succeeded: ' + query)
         }
      }

   };
