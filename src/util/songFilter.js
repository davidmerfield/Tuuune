Tuuune.filter = function (songs, options) {

  // Takes list of songs, returns a list of songs which passes each test

  var results = [],
      
      banned = { 

        // Sequences of characters forbidden in song titles
        snippets: [
          'perform', 'interview','!!', '..', '+', '*', '??',
          '@','#','TEDx','.wmv', '.mov', '.flv', '.avi', '.mp3',
          '.mpg', '.com'
        ],

        // Words forbidden from song titles
        words: [
          'live', 'choir', 'chorus', 'medley', 'monologue',
          'university', 'college', 'encore', 'duet', 'vs.', 'vs',
          'moshcam', 'premiere', 'dvd', 'Eurovision', 'sxsw',
          'improv', 'band', 'quartet', 'choral', 'chorale', 'philharmonic',
          'concerto', 'requiem', 'improvisation', 'recital', 'conducted',
          'composed', 'talent show', 'talent', 'the voice', 'x-factor',
          'x factor', 'festival', 'suite', 'idol', 'contest', 
          'middle school', 'high school', 'capella', 'bonaroo', 
          'radio', 'love', 'loves', 'found myself', 'forsaken', 'making of',
          'octet', 'best of', 'barbershop', 'recording', 'song', 'release', 
          'orchestra', 'backstage', 'behind the scenes', 'parody', 'gig', 
          'rehearsal', 'acoustic', 'tour', 'part', 'hard rock cafe', 'broadcast',
          'violin', 'piano', 'hall of fame', 'documentary', 'tv show', 
          'awards', 'music theory', 'arrangement', 'compilation', 'film', 
          'lesson', 'tabs', 'tutorial', 'theme', 'kickstarter', 'session', 
          'blog', 'vlog', 'concert', 'concierto', 'interview', 'soundtrack', 
          'chord changes', 'instrumental', 'episode', 'test', 'ft.', 'ft', 
          'letterman', 'jimmy kimmel', 'jonathan ross', 'singing', 
          'me covering', 'guitar tab', 'anthem', 'plays', 'playing', 'unofficial',
          'version', 'review', 'at the', 'OST', 'ukelele', 'lute', 'autoharp', 
          'poem', 'clarinet', 'dj', 'beat', 'download', 'd/l', 'ibiza', 'bass', 
          'feat.', 'feat','music', 'guitar', 'castanets', 'mix', 'preview', 'dub',
          'community church', 'mashup', 'vs','sessions','flash mob','featuring',
          'party', 'fuck','tv', 'show', 'ministry', 'subscribers', 'Q&A',

          'Justin Bieber', 'queen', 'One Direction', 'Michael Jackson', 'Temper Trap',
          'dean martin', 'justin timberlake', 'green day', 'cee lo green', 'josh groban', 'harry potter',
          'britney spears', 'modest mouse', 'elton john', 'bob dylan', 'don mclean',
          'katy perry', 'johnny cash', 'snow patrol', 'nickleback', 'idina menzel',
          'timbaland', 'ingrid michaelson', 'shakira', 'lana del rey', 'alabama shakes',
          'radiohead', 'paloma faith', 'the ramones', 'snoop dogg', 'bach', 'the shins',
          'fleet foxes', 'led zeppelin', 'taio cruz', 'birdy', 'paolo nutini', 'willie nelson',
          'iron maiden', 'Guns N\' Roses', 'guns n roses', 'tom waits', 'REM', 'R.E.M',
          'R. Kelly', 'R.Kelly', 'bon iver', 'sinead o connor', 'norah jones', 'hq',
          'red hot chilli peppers', 'paul mcartney', 'taylor swift', 'jason derulo', 'celine dion',
          'billy bragg', 'miley cyrus', 'p!nk', 'modest mouse', 'wu tang clan', 'jay z',
          'ACDC', 'AC/DC', 'freddie mercury', 'beach boys', 'kaiser chiefs', 'black eyed peas',
          'marvin gaye', 'chief keef', 'alicia keys', 'selena gomez', 'armand', 'paramore',
          'macklemore', 'queens of the stone age', 'the kinks', 'jimi hendrix', 'pitbull',
          'twisted sister', '2pac', 'bjork', 'enya', 'jethro tull', 'mariah carey', 'otis redding',
          'lupe fiasco', 'my chemical romance', 'the beatles', 'maroon 5', 'carly rae jepsen',
          'the wanted', 'david bowie', 'rod stewart', 'rolling stones', 'skrillex', 'cher lloyd',
          'frank sinatra', 'kanye west', 'glee', 'linkin park', 'ella fitzgerald', 'billie holiday',
          'ray charles', 'the cure', 'the smiths', 'deep purple', 'eric clapton', 'aerosmith', 'nine inch nails',
          'jarvis cocker', 'pearl jam', 'franz ferdinand', 'madonna', 'oakenfold', 'swedish house mafia','Michael bolton',
          'stevie wonder', 'john legend', 'coldplay', 'verdi', 'oasis', 'minaj', 'nicki minaj',
          'van morrison', 'tina turner','talking heads', 'pretenders', 'R.E.M.', 'elvis presley',
          'kasabian', 'streisand', 'blur', 'kt tunstall', 'david guetta', 'busta rhymes', 'flo rida', 'tyga', 'nirvana',
          'ice cube', 'soulja boy', 'manic street preachers', 'tom petty', 'die antwoord', 'gershwin', 'ian brown', 'joy division',
          'foo fighters', 'the clash', 'offspring', 'annie lennox', 'noel gallagher','debussy', 'mozart', 'aphex twin',
          'iggy pop',  'depeche mode', 'wainwright', 'westlife', 'ellie goulding', 'judas priest','macfarlane', 'rick ross', 'metallica', 'a.c.d.c.',
          'beyonce', 'pet shop boys', 'backstreet boys', 'hello kitty', 'my little pony', 'vivaldi', 'gaga'
        ]
      };

  if (options.exclude.covers) {
    banned.snippets.push('cover', 'tribute')
  };

  if (options.exclude.remixes) {
    banned.snippets.push('remix', 'rework', 'rmx')
  };

  if (options.exclude.foreign) {
    var nonEnglish = new RegExp("[^\x00-\x7F]+");
  };

  for (var i = 0; i < songs.length; i++) {

    var song = songs[i];

    // Ignore songs which are too long or too short
    if (song.duration < options.minDuration ||
        song.duration > options.maxDuration)  {
      continue
    };

    // Ignore songs with too many or too few listens
    if (song.listens > options.maxListens ||
        song.listens < options.minListens) {
      continue
    };

    // ignore non english songs
    if(nonEnglish && nonEnglish.test(song.pretty.title + ' ' + song.description)) {
      continue
    };

    // skip banned words
    if (hasBanned(song.pretty.title + ' ' + song.description, banned)) {
      continue
    };

    // Song title is all caps, probably not great
    if (song.pretty.title === song.pretty.title.toUpperCase()) {
      continue
    };

    // Song title contains a number
    if (/\d/.test(song.pretty.title)) {
      continue
    };

    // Song title has a dash in it
    if (song.title.indexOf(' - ') === -1) {
      continue
    };

    // Ignore if we've already displayed a song from this artist
    if (alreadyFromArtist(song.pretty.title, results)) {
      continue
    };

    // passed tests, add to queue
    results.push(song);

  };

  return results

  function alreadyFromArtist (title, results) {
    for (var j = 0; j < results.length; j++) {
      var intersection = helper.intersect(title, results[j].pretty.title);
      if (intersection && intersection.length > 6) {
        return true;
      };
    };
    return false
  };

  function hasBanned (words, list) {
    
    words = words.toLowerCase();

    for (var i in list.words) {
      var inWord = words.indexOf(list.words[i].toLowerCase());
      if (inWord > -1) {
        var isWord = words.charAt(inWord - 1).trim() + words.charAt(inWord + list.words[i].length).trim();
        if (isWord.length === 0) {
          return true
        };
      };
    };
    
    for (var i in list.snippets) {
      if (words.indexOf(list.snippets[i]) > -1) {
        return true
      };
    };    

    return false
  };
};