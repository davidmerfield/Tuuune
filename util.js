function loadUtilities() {
  return {

    makeDateRange: function(){

      var min = new Date(2007, 1, 1),
          minValue = min.valueOf(),

          max = new Date(),
          maxValue = max.valueOf(),

          delta = maxValue - minValue;

      afterValue = Math.floor(Math.random()*delta) + minValue;

      after = new Date(afterValue);
      before = new Date(after.getFullYear(), after.getMonth(), after.getDate()+4);

      return {'after': this.ISODateString(after), 'before': this.ISODateString(before)};

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
    hasBanned: function (string, phrases) {
      for (var i in phrases){
        var phrase = phrases[i];
            regex = new RegExp( '(' + ' ' + phrase + ')', 'gi' );
          if (regex.test(string)) {return true}
      }
      return false
    },
    tidyTitle: function (title) {
        
        console.log('initial title: ' + title);

        title = title.replace(/ *\[[^)]*\] */g, "");

        var getParens = /\((.*?)\)/;
            

            title = removeBanned(title, [
              'official video',
              'official audio',
              'official music video',
              'music video',
              'unofficial music video',
              'audio stream',
              'new release',
              'studio version',
              'lyrics'
            ]);

            function removeBanned(string, phrases) {
              for (var i in phrases){
                var phrase = phrases[i];
                    regex = new RegExp( '(' + ' ' + phrase + ')', 'gi' );
                
                string = string.replace(regex, " " );
              }
              return string
            }

            if (title.match(getParens)) {

              parensContent = title.match(getParens)[0];

              console.log(parensContent);

              if (parensContent.indexOf('remix') === -1 && parensContent.indexOf('Remix') === -1) {
                title = title.replace(/ *\[[^)]*\] */g, "").replace(/ *\([^)]*\) */g, "");
              }

            }

            console.log('final title: ' + title);
            
            title = title.trim();
            
            title = title.replace(/"/g, '');

            while (title.substr(title.length - 1) === '-') {
              title = title.slice(0, - 1);
            }

            return title
    },
    ISODateString: function (d){
     function pad(n){return n<10 ? '0'+n : n}
     return d.getUTCFullYear()+'-'
          + pad(d.getUTCMonth()+1)+'-'
          + pad(d.getUTCDate())+'T'
          + pad(d.getUTCHours())+':'
          + pad(d.getUTCMinutes())+':'
          + pad(d.getUTCSeconds())+'Z'
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