function SongList () {

   return (function () {

      var songs = [];

      // Adds array of new songs to song list
      songs.add = function (newSongs){

         var newSong = newSongs.shift();

         // We check all the songs on the list
         for (var i = 0; i < this.length; i++){
            
            // and ignore the new song if its already in the list         
            if (this[i].id === newSong.id) {
               return this.add(newSongs);
            };
         };

         // Since the song is not already on the list
         this.push(newSong);

         // Check if this was the last song to add
         if (newSongs.length === 0) {return this};

         // Otherwise call this again
         return this.add(newSongs);
         
      };

      // Returns the song which has the passed id
      songs.find = function (id) {

         for (var i = 0; i < this.length; i++){

            if (this[i].id === id) {
               return this[i]
            };
         };

         return this

      };

      // Returns the rest of the list after the song with the passed id
      songs.findAfter = function (id) {
         
         for (var i = 0; i < this.length; i++){
            
            if (this[i].id === id) {
               return this.slice(i + 1, this.length);
            };
         };

         return this
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
      
      // Remove all the songs on the list
      songs.reset = function () {
        this.splice(0,this.length)
       };

      return songs

   }());
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