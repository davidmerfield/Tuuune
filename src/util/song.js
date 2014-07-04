Tuuune.Song = (function(){

  var template = 
       '<span class="song" data-id="{{id}}">' +
         '<span class="thumbnail" style="background: url({{thumbnail}}) no-repeat center center;background-size: cover"><img src="" /></span>' +
         '<span class="hoverOverlay">' +
           '<button class="play" data-action="play">&#9654; Play</button>' +
           '<button class="addToQueue" data-action="addToQueue">+ Play next</button>' +
         '</span>' +
          '<button class="title" data-action="play">{{tinyTitle}}</button> ' +
          '<button class="star" data-action="star" data-isStarred="{{isStarred}}">&#9733;</button>' +
          '<span class="stats">' +
            '<span class="duration">{{pretty.duration}} / </span>' +
            '<span class="views">{{pretty.listens}} listens</span>' +
          '</span>' +
       '</span>',

     playerTemplate = 
        '<span class="thumbnail" data-action="togglePlay" style="background: url({{thumbnail}}) no-repeat center center;background-size: cover"><img src="" /></span>' +
        '<span class="title">{{pretty.title}}</span> ' +
        '<span class="progressBar" data-action="setProgress">' +
          '<span class="currentTime">0:00</span>' +
          '<span class="progress"></span>' +
          '<span class="duration">{{pretty.duration}}</span>' +
        '</span>' +
        '<section class="controls">' +
          '<button class="previous" data-action="previous"></button>' +
          '<button class="togglePlay" data-action="togglePlay"></button>' +
          '<button class="next" data-action="next"></button>' +
          '<a class="permalink" data-action="permalink" target="_blank" href="{{source.permalink}}">&#9099;</a>' +
          '<button class="star" data-action="star" data-isStarred="{{isStarred}}">&#9733;</button>' +
        '</section>';


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

  function addListener (el, songs) {

    $(el).on('click', '[data-action]', function(e){

      // Import any modules we might need
      var starred = include('starred'),
          player = include('player'),
          queue = include('queue'),

          // Find the id of the song which was clicked
          id = $(this).parents('.song').attr('data-id'),

          // Find the song from the id
          song = songs ? songs.find(id) :
                         queue.find(id),
          
          // Find what we need to do to the song
          action = $(this).attr('data-action');

      switch (action) {
        
        case 'play':
          return player.play(song, songs);          

        case "togglePlay":
          return player.toggle();

        case "next":
          return player.play(queue.after(song));

        case "previous":
          return player.play(queue.before(song));

        case "setProgress":
          return player.setProgress(e.pageX);
        
        case 'addToQueue':
          return queue.add(song);

        case 'star':
          return starred.toggle(song);
        
        case "permalink":
          return player.pause();
      };

    });
  };

  return {
    addListener: addListener,
    create: create,
    template: template,
    playerTemplate: playerTemplate
  };

}());