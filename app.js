var foo;

$(function() {

  var results = document.getElementById('results'),

      searchDefaults = {
        part: 'snippet',
        q: 'a',
        order: 'rating',
        // publishedAfter: 'DATE',
        regionCode: 'US',
        // videoEmbeddable: 'true',
        videoCategoryId: '10',
        // safeSearch: 'none',
        type: 'video',
        videoCaption: 'closedCaption',
        key: 'AIzaSyC_URB8fBLx2waLcJ29-8hlihfmz4Xlzn4',
        maxResults: '50',
        // videoDuration: 'short'
      };

      function makeQueryURL (query, defaults) {
        
        var url = '';
            baseURL = 'https://www.googleapis.com/youtube/v3/';

        for (key in defaults) {
          url += encodeURIComponent(key) + '=' + encodeURIComponent(defaults[key]) + '\&'
        };

        return baseURL + query + '?' + url
      };

  results.innerHTML = makeQueryURL('search', searchDefaults); 

  function render(results){
    var html;
    for (var i in results) {
      var result = results[i];
      html += "<span class='result'>" + result.title + '</span>'
    }
    results.innerHTML = html
  };

  function findVideos() {
   $.getJSON({
     query: makeQueryURL('search', videoIDs),
     response: function(){
       return getVideoData(data)
     }
   });
  }

  // Youtube doesn't return video stats in search results
  // So we extract video IDs from search results then retrieve stats for each one
  // Thankfully we can pass multiple video ids in one request
  function getVideoData(searchResults) {
    var videoIDs = [];
    for (var snippet in searchResults) {
      videoIDs.push(searchResults[snippet].video);
    };

    $.getJSON({
      query: makeQueryURL('search', videoIDs),
      response: function(){
        return filterResults(data)
      }
    });
  };

  function filterResults(videos) {
    var results = [];
    for (var snippet in videos) {
      var video = data[snippet];
      // Check if video is well liked
      if (video.dislikes/video.likes > 0.05) {
        break
      }
      // Check if video has few views
      if (video.views > 100000) {
        break
      }

      results.push(video);

    }
    return render(results);
  };

});