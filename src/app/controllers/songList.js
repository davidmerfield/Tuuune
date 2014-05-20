var songList = (function () {

   function get (id, songlist) {

     for (var i in songlist) {
       
       if (songlist[i].id && songlist[i].id === id) {
         return songlist[i]
       };
     };
   };

   function getSongsAfter(song, songlist) {

     for (var i in songlist) {
       
       if (songlist[i].id && songlist[i].id === song.id) {
         return songlist.slice(i + 1)
       };
     };
   };

   function drop (id, songlist) {
     
     for (var i in songlist) {

       if (songlist[i].id && songlist[i].id === id) {
         songlist.splice(i, 1);
       };
       
     };
   };  

   function add (newSongs, songlist) {
     
     if (newSongs.length === 0) {return songlist};

     var newSong = newSongs.pop();

     for (var i in songlist) {
       if (newSong.id === songlist[i].id) {
         
         // ignore this item we have it already
         return add(newSongs, songlist);
       };
     };

     // item is unique, add it to old items
     songlist.push(newSong);

     return add(newSongs, songlist);
   };

   
}());