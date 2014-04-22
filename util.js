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
    makeDateRange: function(){

      var min = new Date(2008, 1, 1),
          minValue = min.valueOf(),

          max = new Date(),
          maxValue = max.valueOf(),

          delta = maxValue - minValue;

      afterValue = Math.floor(Math.random()*delta) + minValue;

      after = new Date(afterValue);
      before = new Date(after.getFullYear(), after.getMonth(), after.getDate()+3);

      console.log(after);
      console.log(before);
      
      return {'after': after, 'before': before};

    },
    parseYTDuration: function(duration) {
      var a = duration.match(/\d+/g);

      if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
          a = [0, a[0], 0];
      }

      if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
          a = [a[0], 0, a[1]];
      }
      if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
          a = [a[0], 0, 0];
      }

      duration = 0;

      if (a.length == 3) {
          duration = duration + parseInt(a[0]) * 3600;
          duration = duration + parseInt(a[1]) * 60;
          duration = duration + parseInt(a[2]);
      }

      if (a.length == 2) {
          duration = duration + parseInt(a[0]) * 60;
          duration = duration + parseInt(a[1]);
      }

      if (a.length == 1) {
          duration = duration + parseInt(a[0]);
      }
      return duration
    },
    pad: function(num, size) {
              var s = num+"";
              while (s.length < size) s = "0" + s;
              return s;
    },