var soundcloud = function () {

  var key = '4be98cd2ee41fa05bf2f530b3fe042b5',
      pageSize = 50;

  SC.initialize({
    client_id: key
  });

   function getSongs (userOptions, callback) {

      var dateRange = helper.makeDateRange(),
          after = helper.formatDate(dateRange.after),
          before = helper.formatDate(dateRange.before);

      console.log(after);
      console.log(before);

      SC.get('/tracks', {limit: pageSize, created_at: {from: after, to: before}}, function(tracks) {
         console.log(tracks);
         // return callback(filter(tracks))
      });

   };

   function filter(songs) {
      var results = [],
          maxListens = 100000,
          minListens = 400;

      for (var i in songs) {
         var song = songs[i],
             listens = song.playback_count;

         if (listens > maxListens ||
             listens < minListens) {
            continue
         }

         if (song.track_type === 'live') {
            continue
         }

         if (!song.streamable) {
            continue
         }

         // if (hasBanned(song.title)) {

         if (foo) {
            continue
         }

         results.push(song)
      }

      return results
   };

  return {
    getSongs: getSongs
  }
}