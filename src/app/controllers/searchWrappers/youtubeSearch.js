var youtubeSearch = (function () {

  var key = 'AIzaSyC_URB8fBLx2waLcJ29-8hlihfmz4Xlzn4',
      baseURL = 'https://www.googleapis.com/youtube/v3/',
      videoURL = 'https://www.youtube.com/watch?v=',

      sourceName = 'youtube',
      prefix = 'YT_', // used to store videos retrieved

      exports = {
        getSongs: getSongs
      };

  function getSongs (userOptions, callback) {

    var dateRange = helper.makeDateRange(),
        options = {
          order: 'rating',
          publishedAfter: helper.ISODateString(dateRange.after),
          publishedBefore: helper.ISODateString(dateRange.before),
          regionCode: userOptions.regionCode || 'US',
          topicID: userOptions.topicID || null
        };

    getVideoIDs(options, function(videoIDs){
      
      getMetadata(videoIDs, function(videos){
        return callback(filter(videos));

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
      // do shit
    } else {
      // console.log('YT Api call succeeded: ' + query)
    }
  };

  function filter (videos) {
    
    var results = [],
        maxDislikeRatio = 0.015, // ratio of dislikes to likes
        minLikeRatio = 0.0065; // ratio of likes to views

    for (var i in videos) {
      
      var video = videos[i],
          likes = parseInt(video.statistics.likeCount),
          dislikes = parseInt(video.statistics.dislikeCount),
          views = parseInt(video.statistics.viewCount);

      if (dislikes / likes > maxDislikeRatio) {
        continue
      }

      if ((likes + dislikes) / views < minLikeRatio) {
        continue
      }

      results.push(newSong({

        id: video.id,
        prefix: prefix,
        sourceName: sourceName,

        title: video.snippet.title,
        
        thumbnail: video.snippet.thumbnails.medium.url,
        duration: helper.parseYTDuration(video.contentDetails.duration),
        
        url: videoURL + video.id,
                
        listens: views,
        popularity: {
          likes: likes,
          dislikes: dislikes
        }

    }));
      
    }

    return results
  };

  return exports;
  
}());