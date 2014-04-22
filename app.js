var apiKey = 'AIzaSyC_URB8fBLx2waLcJ29-8hlihfmz4Xlzn4';
    dictionary = "Adult Aeroplane Air Aircraft Airforce Airport Alphabet Apple Arm Baby Backpack Balloon Banana Bank Bathroom Bathtub Bed Bee Bird Bomb Book Boss Bottle Bowl Box Boy Brain Bridge Butterfly Button Carpet Carrot Cave Chair Chess Board Chief Child Chisel Church Church Circle Coffee shop Comet Compass Crystal Cup Cycle Drink Drum Dung Ears Earth Egg Electricity Elephant Eraser Explosive Eyes Family Fan Feather Festival Film Finger Fire Floodlight Flower Foot Fork Freeway Fruit Game Garden Gas Gate Gemstone Girl Gloves God Grapes Guitar Hammer Hat Highway Horoscope Horse Hose Ice Insect Jet fighter Junk Kaleidoscope Kitchen Knife Leather jacket Leg Library Liquid Magnet Man Map Maze Meat Meteor Microscope Milk Milkshake Mist Money $$$$ Monster Mosquito Mouth Nail Navy Necklace Needle Onion PaintBrush Pants Parachute Passport Pebble Pendulum Pepper Perfume Pillow Plane Planet Pocket Post Potato Printer Prison Pyramid Radar Rainbow Record Restaurant Rifle Ring Robot Rock Rocket Roof Room Rope Saddle Salt Sandpaper Sandwich Satellite School Sex Ship Shoes Shop Shower Signature Skeleton Slave Snail Software Solid Space Shuttle Spectrum Sphere Spice Spiral Spoon Sports-car Spot Light Square Staircase Star Stomach Sun Sunglasses Surveyor Swimming Pool Sword Table Tapestry Teeth Telescope Television Tennis racquet Thermometer Tiger Toilet Tongue Torch Torpedo Train Treadmill Triangle Tunnel Typewriter Umbrella Vacuum Vampire Videotape Vulture Water Weapon Web Wheelchair Window Woman Worm Xray " + 
                 "white yellow gold red green blue black pink orange the of and a to in is you that it he was for on are as with his they I at be this have from or one had by word but not what all were we when your can said there use an each which she do how their if will up there about out many then them these so some her would make like him into time has look two more write go see number no way could people my than first water been call who oil its now find long down day did get come made may part".split(' ');
    randomWord = function () {return dictionary[Math.floor(Math.random() * dictionary.length)]},
    nonEnglish = new RegExp("[^\x00-\x7F]+");


$(function() {

  $('#showAdvanced').click(function(){
    $('#advanced').toggleClass('hide');
  });

  var output = document.getElementById('results'),
      util = loadUtilities(),
      options = {
        likestoViews: 0.01,
        likeRatio: 0.01,
        minViews: 500,
        maxViews: 100000,
        remix: true
      };

  var videos = [];
      Window.queue = [],
      Window.playHistory = [],
      Window.currentSong = 0;

  findVideos();

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

      // Check if video is well liked
      if (video.statistics.dislikeCount / video.statistics.likeCount > options.likeRatio) {
        continue
      } 

      // check for non english characters
      if( nonEnglish.test(video.snippet.title)) {
        continue
      }

      if (video.statistics.likeCount/video.statistics.viewCount < options.likestoViews){
        continue
      }

      if (video.statistics.likeCount < options.minLikes) {
        continue
      }

      // Check if video has few views
      if (video.statistics.viewCount > options.maxViews ||
          video.statistics.viewCount < options.minViews) {
        continue
      }

      // passed tests, add to queue
      queue.push(video);        
      
    };
    Window.queue = queue;
    return render(queue);
  }

  function render(queue){
    var html = '';

    for (var i in queue) {
      var video = queue[i];
      html += "<a class='result' href='#' id='" + video.id + "'>"
                 + video.snippet.title
                 + '<span class="thumb"><img src="' + video.snippet.thumbnails.default.url + '" /></span>'
            + '</a>'

    };

    output.innerHTML = html;
    
    $('.result').click(function(){
       console.log('called');
       var id = $(this).attr('id');
       player.setVideo(id);
       player.play();
    });

  };


});
