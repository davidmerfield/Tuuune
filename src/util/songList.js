Tuuune.SongList = function SongList (songs) {

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
              this.splice(i,1);
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
         
         var html = '',
             song = include('Song');
         
         for (var i = 0; i < this.length; i++){

            // Use truncated title
            this[i].tinyTitle = helper.truncate(this[i].pretty.title, 65);

            html += Mustache.render(song.template, this[i]);
         };

         return html

      };

      return songs

   }(songs));
};