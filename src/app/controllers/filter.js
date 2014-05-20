var filter = function (songs, options) {

   console.log('ALL SONGS: ' + songs.length);

   var results = [],
       bannedWords = [
         '#', '@',

         'live', 'radio', 'choir', 'medley', 'monologue',
         'university', 'college', 'encore', 'duet',
         'moshcam', 'premiere', 'dvd', 'Eurovision', 'sxsw',
         'improv', 'TEDx', 'band', 'quartet', 'choral', 'chorale',
         'concerto', 'requiem', 'improvisation', 'semifinal', 'recital',
         'festival', 'suite', 'idol', 'contest', 'Q&A', 'middle school',
         'high school', 'capella', 'a cappella', 'bonaroo', 'subscribers',
         'octet', 'best of', 'barbershop', 'recording', 'song',
         'music', 'orchestra', 'backstage', 'behind the scenes', 'parody', 'making of',
         'w/', 'rehearsal', 'acoustic', 'tour', 'part', '@', '#',
         'violin', 'piano', 'hall of fame', 'documentary',
         'awards', 'music theory', 'arrangement',
         'lesson', 'tabs', 'tutorial', 'theme', 'kickstarter', 'session',
         'blog', 'vlog', 'concert', 'concierto', 'interview', 'soundtrack',
         'chord changes', 'instrumental', 'episode', 'performance',
         'letterman', 'jimmy kimmel', 'jonathan ross', 'me singing',
         'me covering', 'guitar tab', 'performed by', 'me performing',
         'dubstep', 'jazz', 'rap', 'hiphop', 'anthem',
         'version', 'review', '.wmv',
         '.mov', '.avi', '.mp3', '.mpg', 'at the', 'OST',

         'Justin Bieber', 'One Direction', 'Michael Jackson', 'Temper Trap',
         'dean martin', 'justin timberlake', 'cee lo green', 'josh groban',
         'britney spears', 'modest mouse', 'elton john', 'bob dylan', 'don mclean',
         'katy perry', 'johnny cash', 'snow patrol', 'nickleback', 'idina menzel',
         'timbaland', 'ingrid michaelson', 'shakira', 'lana del rey', 'alabama shakes',
         'radiohead', 'paloma faith', 'the ramones', 'snoop dogg', 'bach', 'the shins',
         'fleet foxes', 'led zeppelin', 'taio cruz', 'birdy', 'paolo nutini', 'willie nelson',
         'iron maiden', 'Guns N\' Roses', 'guns n roses', 'tom waits', 'REM', 'R.E.M',
         'R. Kelly', 'R.Kelly', 'bon iver', 'sinead o connor', 'norah jones', 'hq',
         'red hot chilli peppers', 'paul mcartney', 'taylor swift', 'jason derulo',
         'billy bragg', 'miley cyrus', 'p!nk', 'modest mouse', 'wu tang clan',
         'ACDC', 'AC/DC',
         'macklemore', 'queens of the stone age', 'the kinks', 'jimi hendrix',
         'twisted sister', '2pac', 'bjork', 'enya', 'jethro tull', 'mariah carey',
         'lupe fiasco', 'my chemical romance', 'the beatles', 'maroon 5', 'carly rae jepsen',
         'the wanted', 'david bowie', 'rod stewart', 'rolling stones', 'skrillex', 'cher lloyd'
      ];

   if (options.exclude.covers) {
      bannedWords.push('cover', 'covered', 'covers', 'tribute')
   }

   if (options.exclude.remixes) {
      bannedWords.push('remix', 'remixx', 'remixxx', 'remixed')
   }

   if (options.exclude.foreign) {
      var nonEnglish = new RegExp("[^\x00-\x7F]+");
   }

   for (var i in songs) {

      var song = songs[i];

      // Check if video has too few or too many views 
      if (song.listens > options.maxListens ||
          song.listens < options.minListens) {
         continue
      }
      
      // ignore non english songs
      if(nonEnglish && nonEnglish.test(song.title)) {
         continue
      }

      // skip banned words
      if (hasBanned(song.title, bannedWords)) {
         continue
      }

      // Song title contains a number
      if (/\d/.test(song.title)) {
         continue
      }

      // Song title is very long
      if (song.title.length > 120) {
         continue
      }

      // probably not a song
      if (song.title.indexOf(' - ') === -1) {
         continue
      }

      // Ignore too short or too long videos
      if (song.duration < options.minDuration ||
          song.duration > options.maxDuration)  {
         continue
      };

      // passed tests, add to queue
      results.push(song);        

   };
   
   console.log('PASSED SONGS: ' + results.length); 
     
   return results

   function hasBanned (string, phrases) {
      for (var i in phrases){
         var phrase = phrases[i];
             regex = new RegExp( '(' + phrase + ')', 'gi' );
         if (regex.test(string)) {return true}
      }
      return false
   };


};