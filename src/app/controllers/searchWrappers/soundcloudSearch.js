 var soundcloudSearch = (function (SC) {

  var key = '4be98cd2ee41fa05bf2f530b3fe042b5',
      pageSize = 200,

      sourceName = 'soundcloud',
      prefix = 'SC_', // used to store videos retrieved

      exports = {
        getSongs: getSongs
      };

  function getSongs (userOptions, callback) {

    var dateRange = helper.makeDateRange(2009),
        after = helper.formatDate(dateRange.start),
        before = helper.formatDate(dateRange.end);

    SC.initialize({client_id: key});

    SC.get('/tracks', {limit: pageSize, created_at: {from: after, to: before}}, function(tracks) {
      // console.log(tracks);
       return callback(filter(tracks))
    });

  };

  function filter(songs) {

    var results = [],
        savesToPlays = 0;

    for (var i in songs) {

      var song = songs[i],
          listens = song.playback_count,
          likes = song.favoritings_count;

      if (song.track_type === 'live') {
        continue
      };

      if (!song.streamable) {
        continue
      };

      if (!song.artwork_url) {
        continue
      };

      if (likes/listens < 0.01) {
        continue
      };
      
      results.push(newSong({

        id: song.id,

        prefix: prefix,

        sourceName: sourceName,

        title: song.title,
        description: '',
        thumbnail: song.artwork_url,
        duration: song.duration,

        sourceID: song.id,
        url: song.uri,

        listens: listens,

        popularity: {
          likes: likes,
          dislikes: 0, // SC doesn't let you dislike, this isn't a hugely important indicator anyway
          ratio: likes/listens
        }
      }));


    };

    return results
  };

  return exports;

}(SC));