var helper = {
   makeDateRange: function(earliestYear, rangeSize){

    earliestYear = earliestYear || 2009;
    rangeSize = rangeSize || 86400000; // 1 day in milliseconds

     var earliestTime = new Date(earliestYear, 1, 1).valueOf(),
         currentTime = new Date().valueOf(),

     // Pick a random point to end the date range
     rangeEnd = Math.round(Math.random()*(currentTime - earliestTime)) + earliestTime;

     console.log(rangeSize);
     console.log(rangeEnd);
     console.log(rangeEnd - rangeSize);

     end = new Date(rangeEnd);
     
     start = new Date(rangeEnd - rangeSize);

     return {'start': start, 'end': end};

   },   
   duplicate: function (object) {
      return JSON.parse(JSON.stringify(object))
   },
   createGrid: function (rows, columns) {
       var grid = new Array(rows);
       for(var i = 0; i < rows; i++) {
           grid[i] = new Array(columns);
           for(var j = 0; j < columns; j++) {
               grid[i][j] = 0;
           }
       }
       return grid;
   },
   intersect: function (first, second) {
           
     var grid = this.createGrid(first.length, second.length);
     var longestSoFar = 0;
     var matches = [];

     for(var i = 0; i < first.length; i++) {
         for(var j = 0; j < second.length; j++) {
             if(first.charAt(i) == second.charAt(j)) {
                 if(i == 0 || j == 0) {
                     grid[i][j] = 1;
                 }
                 else {
                     grid[i][j] = grid[i-1][j-1] + 1;
                 }
                 if(grid[i][j] > longestSoFar) {
                     longestSoFar = grid[i][j];
                     matches = [];
                 }
                 if(grid[i][j] == longestSoFar) {
                     var match = first.substring(i - longestSoFar + 1, i + 1);
                     matches.push(match);
                 }
             }
         }
     }
     return matches[0];
   },
   //Formats d to MM/dd/yyyy HH:mm:ss format
   formatDate: function (d){
     function addZero(n){
        return n < 10 ? '0' + n : '' + n;
     }

       return addZero(d.getFullYear()) + '-' + addZero(d.getMonth() + 1) + "-" + addZero(d.getDate()) + " " + 
              addZero(d.getHours()) + ":" + addZero(d.getMinutes()) + ":" + addZero(d.getMinutes());
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
   pad: function(num, size) {
      var s = num+"";
      while (s.length < size) s = "0" + s;
      return s;
   },
   tidyTitle: function (title) {
      
      title = title.replace(/ *\[[^)]*\] */g, "");

      var getParens = /\((.*?)\)/;

          title = removeBanned(title, [
            'official video',
            'official audio',
            'official music video',
            'music video',
            '.mp3',
            '.wmv',
            '.mov',
            '.mpg',
            '.avi',
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

            if (parensContent.indexOf('remix') === -1 && parensContent.indexOf('Remix') === -1) {
              title = title.replace(/ *\[[^)]*\] */g, "").replace(/ *\([^)]*\) */g, "");
            }

          }
          
          title = title.trim();
          
          title = title.replace(/"/g, '');

          while (title.substr(title.length - 1) === '-') {
            title = title.slice(0, - 1);
          }

      return title         
   },
   // Not mine
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
      return duration*1000
   }      
};
