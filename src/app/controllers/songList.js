function SongList (songs) {

   var template = 
      '<span class="song" id="{{id}}">' +
        '<span class="thumbnail" style="background: url({{thumbnail}}) no-repeat center center;background-size: cover"><img src="" /></span>' +
        '<span class="hoverOverlay">' +
          '<button class="play">&#9654; Play</button>' +
          '<button class="addToQueue">+ Play next</button>' +
        '</span>' + 
         '<button class="play">{{tinyTitle}}</button> ' +
         '<button class="star" data-isStarred="{{#isStarred}}starred{{/isStarred}}">&#9733;</button>' +
         '<span class="stats">' +
           '<span class="duration">{{pretty.duration}} / </span>' +
           // '<span class="ratio">{{popularity.ratio}} &#8226; </span>' +
           '<span class="views">{{pretty.listens}} listens</span>' +
           // '<span class="source">{{source.name}}</span>' +
         '</span>' +
         // '<span class="description">{{description}}</span>' +
      '</span>';

   return (function (songs) {

      var songs = songs || [];

      // Adds array of new songs to song list
      songs.add = function (newSongs){

         for (var i = 0; i < newSongs.length; i++) {
            
            var newSong = newSongs[i];

            if (!this.find(newSong.id)) {
               this.push(newSong);
            };

         };
      };

      // Returns the song which has the passed id
      songs.find = function (id) {

         for (var i = 0; i < this.length; i++){

            if (this[i].id === id) {
               return this[i]
            };
         };

         return false

      };

      // Returns the list up to the song with the passed id
      songs.findBefore = function (id) {
         
         for (var i = 0; i < this.length; i++){
            if (this[i].id === id) {
               return this.slice(0, i);
            };
         };

         return false

      };

      // Returns the rest of the list after the song with the passed id
      songs.findAfter = function (id) {
         
         for (var i = 0; i < this.length; i++){            
            if (this[i].id === id) {
               return this.slice(i + 1, this.length);
            };
         };

         return false
      };

      // Remove a song from the list
      songs.remove = function (id){
         
         for (var i = 0; i < this.length; i++){
            if (this[i].id === id) {
               this.splice(i,1)
            };
         };

         return this
      };
      
      songs.set = function(newSongs) {
         this.splice(0,this.length);
         for (var i = 0; i < newSongs.length; i++) {
            this.push(newSongs[i]);
         };

         return this
      };

      // Remove all the songs on the list
      songs.reset = function () {
        this.splice(0,this.length)
      };

      // 
      songs.render = function () {
         
         var html = '';
         
         for (var i = 0; i < this.length; i++){

            // Use truncated title
            this[i].tinyTitle = helper.truncate(this[i].pretty.title, 65);

            html += Mustache.render(template, this[i]);
         };

         return html

      };

      return songs

   }(songs));
};