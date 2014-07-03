var newSong = function(data) {

   // Make pretty duration
   var mins = Math.floor(data.duration / 60000),
       seconds = helper.pad(Math.floor((data.duration/1000) % 60), 2);

   var song = {

     id: data.prefix + data.id,

     source: {
      name: data.sourceName,
      id: data.id,
      url: data.url,
      permalink: data.permalink
     },

     title: data.title,
     description: data.description,
     thumbnail: data.thumbnail,
     duration: data.duration,

     listens: data.listens,
     popularity: data.popularity,

     isStarred: false,

     pretty: {
      title: helper.tidyTitle(data.title),
      duration: mins + ':' + seconds,
      listens: Math.ceil(parseInt(data.listens)/1000) + 'k'
     }

   };

   return song
};

function isSong (song) {

  // test if song has desired attributes
  
  return true

};
