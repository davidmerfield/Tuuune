Tuuune.Song = (function(){

  var template = 
     '<span class="song" id="{{id}}">' +
       '<span class="thumbnail" style="background: url({{thumbnail}}) no-repeat center center;background-size: cover"><img src="" /></span>' +
       '<span class="hoverOverlay">' +
         '<button class="play">&#9654; Play</button>' +
         '<button class="addToQueue">+ Play next</button>' +
       '</span>' +
        '<button class="play">{{tinyTitle}}</button> ' +
        '<button class="star" data-isStarred="{{isStarred}}">&#9733;</button>' +
        '<span class="stats">' +
          '<span class="duration">{{pretty.duration}} / </span>' +
          '<span class="views">{{pretty.listens}} listens</span>' +
        '</span>' +
     '</span>';

  function create (data) {

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

  function eventHandler (el, songs) {

    // Import any modules we might need
    var starred = include('starred'),
        player = include('player'),

        // Find the id of the song which was clicked
        id = $(el).parents('.song').attr('id'),

        // Find the song from the id
        song = songs ? songs.find(id) :
                       player.queue().user.find(id),
        
        // Find what we need to do to the song
        action = $(el).attr('class');

    switch (action) {
      
      case 'play':
        return player.play(song, songs);          
      
      case 'addToQueue':
        return player.addToQueue(song);

      case 'star':
        return starred.toggle(song);
      
      case 'remove':
        $('#' + id).remove();
        return songs.remove(id);
    };

  };

  return {
    eventHandler: eventHandler,
    create: create,
    template: template
  };

}());