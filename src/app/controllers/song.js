var Song = (function(){

   var exports = {
      init: init,
      render: render
   };

   var template = 
      '<a class="song" href="#" id="{{id}}">' +
         '<span class="thumbnail" style="background: url({{thumbnail}}) no-repeat center center;background-size: cover"><img src="" /></span>' +
         '<span class="title">{{pretty.title}} </span> ' +
         '<span class="buttons">' +
           '<span class="playSong">Play</span>' +
           '<span class="removeSong">Hide</span>' +
           '<span class="starSong">Star</span>' +
           '<span class="queueSong">+ Queue</span>' +
         '</span>' + 
         '<span class="stats">' +
           '<span class="duration">{{pretty.duration}} &#8226; </span>' +
           '<span class="views">{{pretty.listens}} listens &#8226; </span>' +
           '<span class="source">{{source}}</span>' +
         '</span>' +
      '</a>';

   function init () {

      $('body').on('click', '.playSong', function(e){
         $(exports).trigger('playSong', [{id:$(this).parent().parent().attr('id')}]);
         return false;
      });

       $('body').on('click', '.queueSong', function(e){
          e.preventDefault(); // stops click event bubbling to .result
          $(exports).trigger('queueSong', [{id:$(this).parent().parent().attr('id')}]);
       });

       $('body').on('click', '.starSong', function(e){
          e.preventDefault(); // stops click event bubbling to .result
          $(exports).trigger('starSong', [{id:$(this).parent().parent().attr('id')}]);
       });

       $('body').on('click', '.removeSong', function(e){
          e.preventDefault(); // stops click event bubbling to .result
          $(exports).trigger('removeSong', [{id:$(this).parent().parent().attr('id')}]);
          $(this).parent().parent().remove();
       });
   };

   function render(song) {
      return Mustache.render(template, song);
   };

   return exports;

}());