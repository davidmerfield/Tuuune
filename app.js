var foo;

$(function() {

  var results = document.getElementById('results'),

      searchDefaults = {
        q: 'rand dsadom',
        apiKey: 'AIzaSyC_URB8fBLx2waLcJ29-8hlihfmz4Xlzn4',
        order: 'rating',
        publishedAfter: 'DATE',
        maxResults: '50,',
        regionCode: 'USA',
        videoEmbeddable: 'true',
        videoCategoryId: 'music',
        safeSearch: 'none',
        type: 'video',
        videoDuration: 'short'
      };

      function makeQueryURL (query, defaults) {
        
        var url = query;
            baseURL = 'https://www.googleapis.com/youtube/v3/';

        for (key in defaults) {
          url += '\&' + encodeURIComponent(key) + '=' + encodeURIComponent(defaults[key])
        };

        return url
      };

  results.innerHTML = makeQueryURL('search', searchDefaults); 

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