var helper = {
   makeDateRange: function(){

     var min = new Date(2009, 1, 1),
         minValue = min.valueOf(),

         max = new Date(),
         maxValue = max.valueOf(),

         delta = maxValue - minValue;

     afterValue = Math.round(Math.random()*delta) + minValue;

     after = new Date(afterValue);
     before = new Date(after.getFullYear(), after.getMonth(), after.getDate() + 1);

     return {'after': after, 'before': before};

   },   
   duplicate: function (object) {
      return JSON.parse(JSON.stringify(object))
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
