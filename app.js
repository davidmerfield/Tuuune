var apiKey = 'AIzaSyC_URB8fBLx2waLcJ29-8hlihfmz4Xlzn4';
    dictionary = "Adult Aeroplane Air Aircraft Carrier Airforce Airport Alphabet Apple Arm Army Baby Backpack Balloon Banana Bank Barbecue Bathroom Bathtub Bed Bed Bee Bible Bible Bird Bomb Book Boss Bottle Bowl Box Boy Brain Bridge Butterfly Button Cappuccino Car Car-race Carpet Carrot Cave Chair Chess Board Chief Child Chisel Chocolates Church Church Circle Circus Circus Clock Clown Coffee Coffee shop Comet Compact Disc Compass Computer Crystal Cup Cycle Data Base Desk Diamond Dress Drill Drink Drum Dung Ears Earth Egg Electricity Elephant Eraser Explosive Eyes Family Fan Feather Festival Film Finger Fire Floodlight Flower Foot Fork Freeway Fruit Fungus Game Garden Gas Gate Gemstone Girl Gloves God Grapes Guitar Hammer Hat Hieroglyph Highway Horoscope Horse Hose Ice Ice-cream Insect Jet fighter Junk Kaleidoscope Kitchen Knife Leather jacket Leg Library Liquid Magnet Man Map Maze Meat Meteor Microscope Milk Milkshake Mist Money $$$$ Monster Mosquito Mouth Nail Navy Necklace Needle Onion PaintBrush Pants Parachute Passport Pebble Pendulum Pepper Perfume Pillow Plane Planet Pocket Post-office Potato Printer Prison Pyramid Radar Rainbow Record Restaurant Rifle Ring Robot Rock Rocket Roof Room Rope Saddle Salt Sandpaper Sandwich Satellite School Sex Ship Shoes Shop Shower Signature Skeleton Slave Snail Software Solid Space Shuttle Spectrum Sphere Spice Spiral Spoon Sports-car Spot Light Square Staircase Star Stomach Sun Sunglasses Surveyor Swimming Pool Sword Table Tapestry Teeth Telescope Television Tennis racquet Thermometer Tiger Toilet Tongue Torch Torpedo Train Treadmill Triangle Tunnel Typewriter Umbrella Vacuum Vampire Videotape Vulture Water Weapon Web Wheelchair Window Woman Worm Xray " + 
                 "the of and a to in is you that it he was for on are as with his they I at be this have from or one had by word but not what all were we when your can said there use an each which she do how their if will up there about out many then them these so some her would make like him into time has look two more write go see number no way could people my than first water been call who oil its now find long down day did get come made may part".split(' ');
    randomWord = function () {return dictionary[Math.floor(Math.random() * dictionary.length)]},
    nonEnglish = new RegExp("[^\x00-\x7F]+");

$(function() {

  var output = document.getElementById('results'),
      util = loadUtilities(),
      options = {
        minLikes: 30,
        likestoViews: 0.01,
        likeRatio: 0.01,
        minViews: 500,
        maxViews: 30000
      };

  var videos = [];
      Window.queue = [];



  findVideos();

  function findVideos(page) {

    var dates = makeDateRange(),
        after = dates.after,
        before = dates.before;

    var defaults = {
      part: 'snippet',
      q: 'allintitle:"-", -cover, -live, -interview, -album, -soundtrack, -ost, -episode, -review,' + randomWord(),
      topicID: '/m/074ft',
      type: 'video',
      videoEmbeddable: 'true',
      videoSyndicated: 'true',
      regionCode: 'US',
      publishedAfter: util.ISODateString(after),
      // publishedBefore: util.ISODateString(before),
      videoCategoryId: '10',
      key: apiKey,
      maxResults: '50',
    };

    if (page) {defaults['pageToken'] = page};
    
    url = util.makeQueryURL('search', defaults);
    
    $.getJSON(url, function(searchResults,err) {
      console.log(Window.queue.length);
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
      console.log(videoData);
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

function makeDateRange(){

  var min = new Date(2008, 1, 1),
      minValue = min.valueOf(),

      max = new Date(),
      maxValue = max.valueOf(),

      delta = maxValue - minValue;

  afterValue = Math.floor(Math.random()*delta) + minValue;
  beforeValue = Math.floor(Math.random()*(maxValue - afterValue)) + afterValue;

  after = new Date(afterValue);
  before = new Date(beforeValue)

  return {'after': after, 'before': before};

};

function loadUtilities() {
  return {
    searchDefaults: {
      part: 'snippet',
      // q: '',
      order: 'rating',
      // publishedAfter: 'DATE',
      // publishedBefore: 'DATE',
      regionCode: 'US',
      // videoEmbeddable: 'true',
      videoCategoryId: '10',
      // safeSearch: 'none',
      type: 'video',
      videoCaption: 'closedCaption',
      key: apiKey,
      maxResults: '50',
      // videoDuration: 'short'
    },
    videoDefaults: {
      part: 'statistics,snippet',
      id: [],
      key: apiKey
    },   
    makeQueryURL: function (query, defaults) {
      
      var url = '';
          baseURL = 'https://www.googleapis.com/youtube/v3/';

      for (key in defaults) {
        var param = defaults[key];
        if (typeof param == 'object'){
            param = param.join(',');
        };
        url += encodeURIComponent(key) + '=' + encodeURIComponent(param) + '\&'
      };

      return baseURL + query + '?' + url
    }
  }
}