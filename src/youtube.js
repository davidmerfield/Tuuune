// should return a song from video
// Possible model for song info
// {
//   id: SOURCENAME_SOURCEID, // id from source with prefix
//   title: STR,
//   duration: INT,
//   listens: INT,
//   popularity: INT (0-1),
//   artwork: URL,
//   characteristics: {
//     genre: STR
//     cover: BOOL
//     foreign: BOOL  
//   }
// }


var youtube = function () {

  var key = 'AIzaSyC_URB8fBLx2waLcJ29-8hlihfmz4Xlzn4',
      baseURL = 'https://www.googleapis.com/youtube/v3/';

  function getSongs (userOptions, callback) {

    var dateRange = helper.makeDateRange(),
        options = {
          order: 'rating',
          publishedAfter: dateRange.after,
          publishedBefore: dateRange.before,
          regionCode: userOptions.regionCode || 'US',
          topicID: userOptions.topicID || null
        };

    getVideoIDs(options, function(videoIDs){
      
      getMetadata(videoIDs, function(videos){

        return callback(videos);

       });
    });
  };


  function getVideoIDs (options, callback) {

     var videoIDs = [], 
         params = {
           key: key,
           type: 'video',
           part: 'snippet', 
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

        return callback(videoIDs);
       
     });


  };

  function getMetadata (videoIDs, callback) {

     var params = {
        key: key,
        part: 'statistics,snippet,topicDetails,contentDetails',
        id: videoIDs,
     };

     var queryUrl = makeURL('videos', params);

     $.getJSON(queryUrl, function(metadata, err) {

        if (err) {errorHandler(queryUrl, 'getMetadata', err)};

        var results = [];

        for (var i in metadata.items) {
          results.push(metadata.items[i])
        }

        return callback(results);

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