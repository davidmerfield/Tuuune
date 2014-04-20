var apiKey = 'AIzaSyC_URB8fBLx2waLcJ29-8hlihfmz4Xlzn4';
    dictionary = "Adult Aeroplane Air Aircraft Carrier Airforce Airport Alphabet Apple Arm Army Baby Backpack Balloon Banana Bank Barbecue Bathroom Bathtub Bed Bed Bee Bible Bible Bird Bomb Book Boss Bottle Bowl Box Boy Brain Bridge Butterfly Button Cappuccino Car Car-race Carpet Carrot Cave Chair Chess Board Chief Child Chisel Chocolates Church Church Circle Circus Circus Clock Clown Coffee Coffee shop Comet Compact Disc Compass Computer Crystal Cup Cycle Data Base Desk Diamond Dress Drill Drink Drum Dung Ears Earth Egg Electricity Elephant Eraser Explosive Eyes Family Fan Feather Festival Film Finger Fire Floodlight Flower Foot Fork Freeway Fruit Fungus Game Garden Gas Gate Gemstone Girl Gloves God Grapes Guitar Hammer Hat Hieroglyph Highway Horoscope Horse Hose Ice Ice-cream Insect Jet fighter Junk Kaleidoscope Kitchen Knife Leather jacket Leg Library Liquid Magnet Man Map Maze Meat Meteor Microscope Milk Milkshake Mist Money $$$$ Monster Mosquito Mouth Nail Navy Necklace Needle Onion PaintBrush Pants Parachute Passport Pebble Pendulum Pepper Perfume Pillow Plane Planet Pocket Post-office Potato Printer Prison Pyramid Radar Rainbow Record Restaurant Rifle Ring Robot Rock Rocket Roof Room Rope Saddle Salt Sandpaper Sandwich Satellite School Sex Ship Shoes Shop Shower Signature Skeleton Slave Snail Software Solid Space Shuttle Spectrum Sphere Spice Spiral Spoon Sports-car Spot Light Square Staircase Star Stomach Sun Sunglasses Surveyor Swimming Pool Sword Table Tapestry Teeth Telescope Television Tennis racquet Thermometer Tiger Toilet Tongue Torch Torpedo Train Treadmill Triangle Tunnel Typewriter Umbrella Vacuum Vampire Videotape Vulture Water Weapon Web Wheelchair Window Woman Worm Xray advantage advertisement advice agenda apology authorization bill brand budget commission comparison competition competitor confirmation costs creditor customer deadline debt debtor decision decrease deficit delivery department description difference disadvantage distribution employee employer enquiry environment equipment estimate experience explanation facilities factory feedback goal goods growth guarantee improvement increase industry instructions interest inventory invoice knowledge limit loss margin market message mistake objective offer opinion option order output payment penalty permission possibility product production profit promotion purchase reduction refund reminder repairs report responsibility result retailer rise risk salary sales schedule share signature stock success suggestion supply support target transport turnover wholesaler".split(' ');
    randomWord = function () {return dictionary[Math.floor(Math.random() * dictionary.length)]};

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
  findVideos();

  function render(results){
    var html;
    for (var i in results) {
      var result = results[i];
      html += "<span class='result'>" + result.title + '</span>'
    }
    results.innerHTML = html
  };

  function findVideos() {
    var url = makeQueryURL('search', searchDefaults);
    console.log(url);
    $.getJSON(url, function(data,err) {
      console.log(data);
      console.log(err);
      filterResults(data);
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

    $.getJSON(makeQueryURL('search', videoIDs), function(data) {
      console.log(data)
      filterResults(data);
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