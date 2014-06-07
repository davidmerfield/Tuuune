var filter = function (songs, options) {

   var results = [],
       banned = { 
           words: [
             'live', 'choir', 'medley', 'monologue',
             'university', 'college', 'encore', 'duet',
             'moshcam', 'premiere', 'dvd', 'Eurovision', 'sxsw',
             'improv', 'band', 'quartet', 'choral', 'chorale',
             'concerto', 'requiem', 'improvisation', 'recital',
             'festival', 'suite', 'idol', 'contest', 'Q&A', 'middle school',
             'high school', 'capella', 'bonaroo', 'subscribers',
             'octet', 'best of', 'barbershop', 'recording', 'song',
             'music', 'orchestra', 'backstage', 'behind the scenes', 'parody', 'making of',
             'rehearsal', 'acoustic', 'tour', 'part', 'hard rock cafe',
             'violin', 'piano', 'hall of fame', 'documentary', 'tv show',
             'awards', 'music theory', 'arrangement', 'compilation',
             'lesson', 'tabs', 'tutorial', 'theme', 'kickstarter', 'session',
             'blog', 'vlog', 'concert', 'concierto', 'interview', 'soundtrack',
             'chord changes', 'instrumental', 'episode', 'perform', 'performing', 'performance',
             'letterman', 'jimmy kimmel', 'jonathan ross', 'singing',
             'me covering', 'guitar tab', 'performed by', 'me performing', 'anthem',
             'version', 'review', 'at the', 'OST', 'ukelele', 'autoharp', 'guitar',

             'Justin Bieber', 'queen', 'One Direction', 'Michael Jackson', 'Temper Trap',
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
             'ACDC', 'AC/DC', 'freddie mercury', 'beach boys', 'kaiser chiefs',
             'macklemore', 'queens of the stone age', 'the kinks', 'jimi hendrix',
             'twisted sister', '2pac', 'bjork', 'enya', 'jethro tull', 'mariah carey',
             'lupe fiasco', 'my chemical romance', 'the beatles', 'maroon 5', 'carly rae jepsen',
             'the wanted', 'david bowie', 'rod stewart', 'rolling stones', 'skrillex', 'cher lloyd',
             'frank sinatra'
           ],
           snippets: [
            '@','#','TEDx','.wmv', '.mov', '.avi', '.mp3', '.mpg'
           ]};

   if (options.exclude.covers) {
      banned.snippets.push('cover', 'tribute')
   }

   if (options.exclude.remixes) {
      banned.snippets.push('remix')
   }

   if (options.exclude.foreign) {
      var nonEnglish = new RegExp("[^\x00-\x7F]+");
   }

   for (var i = 0; i < songs.length; i++) {

      var song = songs[i];


      // Check if video has too few or too many views 
      if (song.listens > options.maxListens ||
          song.listens < options.minListens) {
         continue
      }
      
      // ignore non english songs
      if(nonEnglish && nonEnglish.test(song.title + ' ' + song.description)) {
         continue
      }

      // skip banned words
      if (hasBanned(song.title + ' ' + song.description, banned)) {
         console.log('skipping ' + song.title);
         continue
      }

      // Song title contains a number
      if (/\d/.test(song.pretty.title)) {
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

      var alreadyFromArtist = false;

      // Ensure there aren't other songs by the same artist
      for (var j = 0; j < results.length; j++) {
         var intersection = helper.intersect(song.pretty.title, results[j].pretty.title);
         if (intersection.length > 6) {
            console.log('Ignoring: ' + song.pretty.title);
            console.log(intersection);            
            alreadyFromArtist = true;
         };
      };

      if (!alreadyFromArtist) {
         // passed tests, add to queue
         results.push(song);                 
      };
   };
        
   return results

   function hasBanned (words, list) {
       words = words.toLowerCase();

       for (var i in list.words) {
           var inWord = words.indexOf(list.words[i].toLowerCase());
           if (inWord > -1) {
               var isWord = words.charAt(inWord - 1).trim() + words.charAt(inWord + list.words[i].length).trim();
               if (isWord.length === 0) {
                  console.log('Has banned word ' + list.words[i]);
                  return true
               };
           };
       };
       for (var i in list.snippets) {
           if (words.indexOf(list.snippets[i]) > -1) {
            console.log('Has banned word ' + list.snippets[i]);
               return true
           };
       };    
       return false
   };
};