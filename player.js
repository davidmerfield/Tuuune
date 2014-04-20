var player = {
   videoLength: 0,
   init: function(){
      this.renderUI();
   },
   videoID: '',
   play: function(){
      if (embed.getPlayerState() === '2') {
         embed.playVideo()
      };
      if (this.videoID === '') {
         this.videoID = Window.queue[0].id
      };
      console.log(this.videoID)
      embed.loadVideoById(this.videoID);
      embed.playVideo();
      this.renderUI();
   },
   setVideo: function(id){
      this.videoID = id;
   },
   updateProgressBar: function(){
      
      var currentTime = embed.getCurrentTime(),
          progress = currentTime/this.videoLength*100,
         buffered = embed.getVideoLoadedFraction()/this.videoLength*100;

      $('#progress').width(progress + '%');
      $('#buffered').width(buffered + '%');

      var mins = Math.floor(currentTime / 60),
         seconds = pad(Math.floor(currentTime % 60),2);

      $('#time').text(mins + ':' + seconds);

      this.videoLength = embed.getDuration();
      
      var totalMins = Math.floor(this.videoLength /60),
          totalSeconds = pad(Math.floor(this.videoLength % 60),2);

      $('#duration').text(totalMins + ':' + totalSeconds);

   },
   renderUI: function () {

      setInterval(this.updateProgressBar, 50);


   }
}


$('#play').click(function(){
   player.play();
});

$('#pause').click(function(){
   embed.pauseVideo();
});



function pad(num, size) {
          var s = num+"";
          while (s.length < size) s = "0" + s;
          return s;
      }
 


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