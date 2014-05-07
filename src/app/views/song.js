var Song = function () {

   var template = 
      '<a class="song" href="#" id="{{id}}">' +
         '<span class="thumbnail"><img src="{{thumbnail}}" /></span>' +
         '<span class="title">{{pretty.title}} </span> ' +
         '<span class="buttons">' +
           '<span class="removeSong">x Hide</span>' +
           '<span class="starSong">* Star</span>' +
           '<span class="queueSong">+ Queue</span>' +
         '</span>' + 
         '<span class="stats">' +
           '<span class="duration">{{pretty.duration}} &#8226; </span>' +
           '<span class="views">{{pretty.listens}} listens &#8226; </span>' +
           '<span class="source">{{source}}</span>' +
         '</span>' +
      '</a>';

   function init () {

      $('body').on('click', '.song', function(e){
         $(document).trigger('playSong', [{id:$(this).attr('id')}]);
         return false;
      });

       $('body').on('click', '.queueSong', function(e){
          e.preventDefault(); // stops click event bubbling to .result
          $(document).trigger('queueSong', [{id:$(this).attr('id')}]);
       });

       $('body').on('click', '.starSong', function(e){
          e.preventDefault(); // stops click event bubbling to .result
          $(document).trigger('starSong', [{id:$(this).attr('id')}]);
       });

       $('body').on('click', '.removeSong', function(e){
          e.preventDefault(); // stops click event bubbling to .result
          $(document).trigger('removeSong', [{id:$(this).attr('id')}]);
       });
   };

   function render(song) {
      return Mustache.render(template, song);
   };

   return {
      init: init,
      render: render
   };

};