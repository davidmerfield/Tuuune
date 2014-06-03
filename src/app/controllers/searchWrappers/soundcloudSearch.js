var soundcloud = (function (SC) {

  var key = '4be98cd2ee41fa05bf2f530b3fe042b5',
      pageSize = 50,

      sourceName = 'soundcloud',
      prefix = 'SC_', // used to store videos retrieved

      exports = {
        getSongs: getSongs
      };

  function getSongs (userOptions, callback) {

    var dateRange = helper.makeDateRange(),
        after = helper.formatDate(dateRange.after),
        before = helper.formatDate(dateRange.before);

    SC.initialize({client_id: key});

    SC.get('/tracks', {limit: pageSize, created_at: {from: after, to: before}}, function(tracks) {
       return callback(filter(tracks))
    });

  };

  function filter(songs) {

    var results = [],
    savesToPlays = 0.01;

    for (var i in songs) {

      var song = songs[i],
          saves = song.comment_count + song.download_count + song.favoritings_count;

      if (song.track_type === 'live') {
        continue
      };

      if (!song.artwork_url) {
        continue
      };

      if (saves/song.playback_count < savesToPlays) {
        continue
      };

      if (!song.streamable) {
        continue
      }

      // Perpahs this should be an object contructor
      results.push(newSong({

        id: song.id,
        
        prefix: prefix,
        
        sourceName: sourceName,

        title: song.title,
        thumbnail: song.artwork_url,
        duration: song.duration,

        sourceID: song.id,
        url: song.uri,

        listens: song.playback_count,
        
        popularity: {
          favourites: song.favoritings_count,
          downloads: song.download_count,
          comments: song.comment_count
        }
      }));


    }

    return results
  };

  return exports;

}(SC));