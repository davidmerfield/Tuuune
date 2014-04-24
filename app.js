var apiKey = 'AIzaSyC_URB8fBLx2waLcJ29-8hlihfmz4Xlzn4';
    nonEnglish = new RegExp("[^\x00-\x7F]+");


$(function() {

  var output = document.getElementById('results'),
      util = loadUtilities(),
      options = {
        likestoViews: 0.01, // ratio of likes to views
        likeRatio: 0.01, // ratio of likes to dislikes
        minViews: 500,
        maxViews: 100000,
        remix: true
      };

  var videos = [];
      Window.queue = [],
      Window.playHistory = [],
      Window.currentSong = 0;

  findVideos();


  $('#showAdvanced').click(function(){
    $('#advanced').toggleClass('hide');
  });


  $('#reload').click(function(){
    recreateQueue();
  });

  function recreateQueue () {

    Window.queue = [];
    videos = [];
    render(Window.queue);
    findVideos();
  }

  function findVideos(page) {

    var dates = util.makeDateRange(),
        after = dates.after,
        before = dates.before;

    var defaults = {
      part: 'snippet',
      type: 'video',
      topicID: '/m/074ft',
      videoEmbeddable: 'true',
      videoSyndicated: 'true',
      regionCode: 'US',
      publishedAfter: util.ISODateString(after),
      publishedBefore: util.ISODateString(before),
      videoCategoryId: '10',
      key: apiKey,
      maxResults: '50',
    };

    if (page) {defaults['pageToken'] = page};
    
    url = util.makeQueryURL('search', defaults);
    console.log(url)

    $.getJSON(url, function(searchResults,err) {
      console.log(searchResults);
      getVideoData(searchResults);
      if (Window.queue.length < 10) {
        findVideos(searchResults.nextPageToken)
      }
    });

  };

  // Youtube doesn't return video stats in search results
  // So we extract video IDs from search results then retrieve stats for each one
  function getVideoData(searchResults) {

    var videoIDs = [];
  
    for (var i in searchResults.items) {
      var video = searchResults.items[i];
      videoIDs.push(video.id.videoId);
    };

    var url = util.makeQueryURL('videos', {
      part: 'statistics,snippet,topicDetails,contentDetails',
      id: videoIDs,
      key: apiKey
    });

    $.getJSON(url, function(videoData) {
      for (var i in videoData.items) {
        videos.push(videoData.items[i])
      };
      return filter(videos);
    });
  };

  function filter(videos) {

    var queue = [];


    for (var i in videos) {
      
      var video = videos[i];
          video.duration = util.parseYTDuration(video.contentDetails.duration);

      // Check if video has few views
      if (video.statistics.viewCount > options.maxViews ||
          video.statistics.viewCount < options.minViews) {
        continue
      }

      // Check if video is well liked
      if (video.statistics.dislikeCount / video.statistics.likeCount > options.likeRatio) {
        continue
      } 

      // if songs by the same artist are returned, shuffle their location
      // easiest way to do this would be to check the uplaoder

      // needs to check for reuploads

      // check against list of top artists

      // check for non english characters
      if( nonEnglish.test(video.snippet.title)) {
        continue
      }

      // Check video has enough likes
      if (video.statistics.likeCount/video.statistics.viewCount < options.likestoViews){
        continue
      }

      var bannedWords = [
        'live',
        'cover',
        'album',
        'tedx',
        'choir',
        'monologue',
        'band',
        'recording',
        'song',
        'orchestra',
        'backstage',
        'parody',
        'making of',
        'rehearsal',
        'acoustic',
        'tour',
        'part',
        '2014',
        '2013',
        '2012',
        '2011',
        '2010',
        '2009',
        '2008',
        '2007',
        '2006',
        'lesson',
        'tabs',
        'tutorial',
        'theme',
        'kickstarter',
        'session',
        'hd',
        'blog',
        'vlog',
        '@',
        '#',
        'concert',
        'music production',
        'beat making',
        'interview', 
        'album', 
        'soundtrack', 
        'ost', 
        'episode',
        'review'
      ];

      // Check if remixes are cool
      if (!options.remix) {
        bannedWords.push('remix')
      }

      // skip banned words
      if (util.hasBanned(video.snippet.title, bannedWords)) {
        continue
      }

      // probably not a song
      if (video.snippet.title.indexOf(' - ') === -1) {
        continue
      }

      // Ignore too short or too long videos
      if (video.duration < 120 || video.duration > 720)  {
        continue
      };

      // Tidy up title string      
      video.snippet.title = util.tidyTitle(video.snippet.title);

      // Make pretty duration
      var mins = Math.floor(video.duration / 60),
          seconds = util.pad(Math.floor(video.duration % 60),2);
          video.prettyDuration = mins + ':' + seconds;

      // Make pretty viewcount
      video.prettyViewCount = Math.round(video.statistics.viewCount/1000) + 'k';
      
      // passed tests, add to queue
      queue.push(video);        
      
    };

    Window.queue = queue;
    return render(queue);
  }

  function render(queue){

    if (queue.length < 5) {
      $('#results').attr('class', 'empty');
      output.innerHTML = '';
      return false
    }

    $('#results').attr('class', '')

    
    //You should check the video's ratio (4:3 or 16:9) and crop the thumbnail to keep that ratio. Not trying to detect the color.
    
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

    $('.removeFromQueue').click(function(e){
      e.preventDefault();
       var id = $(this).parent().parent().attr('id');
       for (var i in Window.queue) {
          var video = Window.queue[i];
          if (video.id === id) {
            // also need to remove it from videos when refiltering occurs
            Window.queue.splice(i,1);      
            $(this).parent().parent().remove();
          }
       };
       for (var i in videos) {
          var video = videos[i];
          if (video.id === id) {
            // also need to remove it from videos when refiltering occurs
            videos.splice(i,1);      
          }
       };
    });

    $('.addToQueue').click(function(){
       var id = $(this).parent().parent().attr('id');
       for (var i in Window.queue) {
          var video = Window.queue[i];
          if (video.id === id) {
            Window.queue.unshift(video);      
          }
       };
    });
    
    $('.result').click(function(){
       var id = $(this).attr('id');
       for (var i in Window.queue) {
          var video = Window.queue[i];
          if (video.id === id) {
            Window.currentSong = video;
            Window.queue = Window.queue.slice(i+1);
            console.log(Window.queue)
            player.play(video);            
          }
       };
    });

  };


});
