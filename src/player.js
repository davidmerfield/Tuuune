$(function() {

   function onYouTubePlayerReady (playerID) {
     console.log('Player ready');
     embed.addEventListener('onStateChange', 'player.stateChange');
   };

   var params = {allowScriptAccess: "always"};

   swfobject.embedSWF("http://www.youtube.com/v/pYVW0I-NnDc&enablejsapi=1&playerapiid=embed", "embed", "425", "365", "8", null, null, params);

});

var player = {

   currentSong: {},
   currentSongProgress: 0,

   queue: [],
   playHistory: [],

   repeatQueue: false,
   shuffleQueue: false,

   // Controllers

   init: function(){

      // If possible, load previous queue, history, play prefs and current song
      // this.getPreviousState();

      // Make a queue from results returned by discover
      this.queue = this.makeQueue();

      if (this.currentSong !== {}) {
          this.currentSong = this.queue.shift();
      };
      
      this.addUIListener();
   },

   close: function() {
      this.savePlayerState()
   },

   makeQueue: function() {
      
      var queue = helper.duplicate(discover.results);

      if (this.shuffleQueue) {
         queue = helper.shuffle(queue)
      }

      return this.queue = queue
   },

   next: function() {
      this.playHistory.unshift(this.currentSong);
      this.currentSong = this.queue.shift();
      
      this.play(this.currentSong);
   },

   previous: function() {
      this.queue.unshift(this.playHistory.shift());
      this.currentSong = this.queue.shift();
      
      this.play(this.currentSong);
   },

   play: function(song) {
      
      if (song) {
         this.currentSong = song;
         this.updateUI.play();
         this.updateUI.songTitle();
         this.updateUI.songDuration();

         return embed.loadVideoById(song.id);
      }
      
      this.updateUI.play();
      return embed.playVideo();
   },
   pause: function() {
      this.updateUI.pause();
      return embed.pauseVideo()
   },
   shuffle: function() {
      
      this.shuffleQueue = !this.shuffleQueue;
      this.updateUI.shuffle();
   },
   repeat: function() {
      this.repeatQueue = !this.repeatQueue;
      this.updateUI.repeat();
   },
   addToQueue: function (song) {
      this.queue.unshift(song);
   },
   progressBar: function(seconds) {
      embed.seekTo(seconds, true)
   },


   // Views

   ui: {
      play: $('#play'),
      pause: $('#pause'),
      next: $('#next'),
      previous: $('#previous'),

      repeat: $('#repeat'),
      shuffle: $('#shuffle'),

      progress: $('#progress'),
      buffered: $('#buffered'),
      currentTime: $('#currentTime'),
      songDuration: $('#songDuration'),
      songTitle: $('#songTitle')
   },

   addUIListener: function() {

      $('#controls a').on('click', function(e){
         
         var id = $(this).attr('id');

         if (id === 'progressBar') {
            console.log(e.pageX);
            console.log($(this).offset());
            console.log($(this).width());
            
            var xOffset = e.pageX - $(this).offset().left,
                ratio = xOffset/$(this).width(),
                seconds = Math.round(ratio*embed.getDuration());

                console.log(seconds);
            return player.progressBar(seconds)
         };

         return player[id]();

      });

   },

   updateUI: {
      
      all: function () {

      },

      play: function() {
         player.ui.play.hide();
         player.ui.pause.show();
      },

      pause: function() {
         player.ui.pause.hide();
         player.ui.play.show();
      },

      repeat: function () {
         player.ui.repeat.toggleClass('enabled')   
      },

      shuffle: function () {
         player.ui.shuffle.toggleClass('enabled')   
      },

      progressBar: function() {

         var currentTime = embed.getCurrentTime(),
             duration = embed.getDuration(),
             progressPercent = currentTime/duration*100,
             bufferedPercent = embed.getVideoLoadedFraction()*100,
             mins = Math.floor(currentTime / 60),
             seconds = helper.pad(Math.floor(currentTime % 60),2);

         player.ui.progress.width(progressPercent + '%');
         player.ui.buffered.width(bufferedPercent + '%');
         player.ui.currentTime.text(mins + ':' + seconds);

         player.currentSongProgress = currentTime;
      },

      songTitle: function() {
         player.ui.songTitle.text(player.currentSong.prettyTitle);
      },

      songDuration: function () {
         player.ui.songDuration.text(player.currentSong.prettyDuration);
      }


   },

   onStateChange: function(e){

      switch (e) {
         case 0: // song ended
            this.next();
         case 1: // playing
         case 2: // paused
         case 3: // buffering
            console.log('player is buffering');
         case 4: // video queued
      }

     // Playing
     if (e === 1) {
       var updateProgressBar = setInterval(player.updateUI.progressBar, 50);
     }

     // song finished
     if (e === 0) {
       clearInterval(updateProgressBar);
       player.next();
     }

     // Paused
     if (e === 2) {
       $('#pause').hide();
       $('#play').show();
       clearInterval(updateProgressBar);
     }

    },

    render: function () {

   }

}

function onYouTubePlayerReady (playerID) {
  embed.addEventListener('onStateChange', 'player.onStateChange');
};



//       seekTo(seconds)

//       setVolume
//       getVolume()
//       getVideoLoadedFraction() // between 0 and 1
//       getPlayerState // unstarted (-1), ended (0), playing (1), paused (2), buffering (3), video cued (5).
//       getCurrentTime() // elapsed seconds

//       player.getDuration()

//       player.addEventListener(event:String, listener:String):Void

//       onStateChange //-1 (unstarted)
// 0 (ended)
// 1 (playing)
// 2 (paused)
// 3 (buffering)
// 5 (video cued).

//       onError

//       mute