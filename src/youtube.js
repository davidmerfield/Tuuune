var youtube = function () {

  var key = 'AIzaSyC_URB8fBLx2waLcJ29-8hlihfmz4Xlzn4',
      baseURL = 'https://www.googleapis.com/youtube/v3/';

  function getSongs (minResults, options, callback, previousResults) {

    options.topicID: = '/m/074ft';
    options.regionCode = 'US';
    options.order = 'rating';

    if (!options.publishedAfter && !options.publishedBefore) {
       var dateRange = helper.makeDateRange();
       options.publishedAfter = dateRange.after;
       options.publishedBefore = dateRange.before;
    }
    
    getVideoIDs(options, function(videoIDs, nextPageToken){
      
      getMetadata(videoIDs, function(videos){

        var results = filter(videos);

        if (previousResults) {
          results = results.concat(previousResults);
        }

        // We've got enough songs, return them
        if (results.length > minResults) {
          return callback(results);
        }

        // Set page token to retrieve next set of videos
        if (nextPageToken) {
          options.pageToken = nextPageToken;
        } else { // we've run out videos in this date range, find more
          options.pageToken = 
          options.publishedBefore =
          options.publishedAfter = null;            
        }
        
        return getSongs(minResults, options, callback, results)

       });
    });
  };

  function getMetadata (videoIDs, callback) {

     var params = {
       part: 'statistics,snippet,topicDetails,contentDetails',
       id: videoIDs,
       key: key
     };

     var queryUrl = makeURL('videos', params);

     $.getJSON(queryUrl, function(metadata, err) {

        var results = [];

        if (err) {errorHandler(queryUrl, 'getMetadata', err)};

        for (var i in metadata.items) {
          console.log(metadata.items[i]);

         results.push(metadata.items[i])
        }

        return callback(results)

     });
  };

  function getVideoIDs (options, callback) {

     var videoIDs = [], 
         params = {
           key: key,
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
     
     var queryUrl = makeURL('search', params);

     $.getJSON(queryUrl, function(searchResults, err) {
        
        if (err) {errorHandler(queryUrl, 'getVideoIDs', err)};
        
        for (var i in searchResults.items) {
          var video = searchResults.items[i];
          videoIDs.push(video.id.videoId);
        };

        return callback(videoIDs, searchResults.nextPageToken);
       
     });


  };

  function makeURL (query, params) {
    
    var url = '';

    for (var i in params) {
      var param = params[i];
      if (!param) {continue};
      if (typeof param == 'object'){
          param = param.join(',');
      };
      url += encodeURIComponent(i) + '=' + encodeURIComponent(param) + '\&'
    };

    return baseURL + query + '?' + url
  };


  function errorHandler (method, query, err) {
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
  };

  function filter (videos) {
    return videos
  };

  return {
    getSongs: getSongs
  }
}