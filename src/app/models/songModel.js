var songModel = function(data) {

   // Make pretty duration
   var mins = Math.floor(data.duration / 60000),
       seconds = helper.pad(Math.floor((data.duration/1000) % 60), 2);

   var song = {

     id: data.prefix + data.id,

     source: {
      name: data.prefix,
      id: data.id,
      url: data.url
     },

     title: data.title,
     thumbnail: data.thumbnail,
     duration: data.duration,

     listens: data.listens,
     popularity: data.popularity,

     pretty: {
      title: helper.tidyTitle(song.title),
      duration: mins + ':' + seconds,
      listens: Math.ceil(song.listens/1000) + 'k'
     }

   };

   return song
}