function SongList (songs) {

   var template = 
      '<a href="#" class="song" id="{{id}}">' +
        '<span class="thumbnail" style="background: url({{thumbnail}}) no-repeat center center;background-size: cover"><img src="" /></span>' +
         '<span class="title">{{pretty.title}} </span> ' +
         '<span class="buttons">' +
           '<span class="playSong">&#9654;</span>' +
           '<span class="removeSong">Hide</span>' +
           '<span class="starSong" data-isStarred="{{#isStarred}}starred{{/isStarred}}">&#9733;</span>' +
           '<span class="queueSong">+ Queue</span>' +
         '</span>' + 
         '<span class="stats">' +
           '<span class="duration">{{pretty.duration}} &#8226; </span>' +
           '<span class="views">{{pretty.listens}} listens &#8226; </span>' +
           '<span class="source">{{source.name}}</span>' +
         '</span>' +
      '</a>';

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
            html += Mustache.render(template, this[i]);
         };

         return html

      };

      return songs

   }(songs));
};

// HI DAVID blah blah, lets kiss. you can touch my boobs for 6 seconds.
// kira is right in front of us dingus
// fine, boring man. If we went on a plane i dont think youd have the BALLS to mile high.
// of course i dont want to make things awkward
// did you enjoy your six seconds?
// i did look how well i can type withought looking at the keyboard
// dorkasourus. i think you a wee honry. i can assume things. im often right.
// not any more than normal
// YES
// wait so you are or not? do you just mean youre always horny 
// usually a tiny bit
// i asumed more because you keep grabbing my vagina slightly 
// HANNAH HANNAH HANNAH ROSE HHANNANAH ROSE hannah rose 