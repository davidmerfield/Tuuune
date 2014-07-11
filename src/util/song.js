Tuuune.Song = (function(){

  var template = 
       '<span class="song" data-id="{{id}}">' +
          '<span class="thumbnail" style="background: url({{thumbnail}}) no-repeat center center;background-size: cover"><img src="" /></span>' +
          '<span class="hoverOverlay">' +
            '<button class="play" data-action="play">&#9654; Play</button>' +
            '<button class="addToQueue" data-action="addToQueue">+ Play next</button>' +
          '</span>' +
          '<span class="title" data-action="play">{{tinyTitle}}</span> ' +
          '<button class="star" data-action="star" data-isStarred="{{isStarred}}">&#9733;</button>' +
          '<span class="stats">' +
            '<span class="views">{{pretty.listens}} listens</span>' +
          '</span>' +
       '</span>';

  function create (data) {

     // Make pretty duration
     var mins = Math.floor(data.duration / 60000),
         seconds = helper.pad(Math.floor((data.duration/1000) % 60), 2);

     if (!data.listens) {
      console.log(data);
     };
     
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
        listens: data.listens.toLocaleString()
       }

     };

     return song
  };

  function listener (e) {

    // Import any modules we might need
    var starred = include('starred'),
        player = include('player'),
        queue = include('queue'),

        // Find the id of the song which was clicked
        id = $(this).attr('data-id'),

        // Find what we need to do to the song
        action = $(e.target).attr('data-action'),

        // Find the song from the id
        songs = e.data,
        song = songs ? songs.find(id) : false;

    if (!song) {throw 'Song not found'};

    switch (action) {
      
      case 'play':
        return player.play(song, songs);          

      case "togglePlay":
        return player.toggle();

      case "next":
        return player.next();

      case "previous":
        return player.previous();

      case "seek":
        return player.seek(e.pageX);
      
      case 'addToQueue':
        return queue.add(song);

      case 'star':
        return starred.toggle(song);
      
      case "permalink":
        return player.pause();
    };
  };

  return {
    create: create,
    template: template,
    listener: listener
  };

}());