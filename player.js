var util = loadUtilities();

$(function() {

    var params = { allowScriptAccess: "always" };

    swfobject.embedSWF(    
        "http://www.youtube.com/v/HWWogO3CWXs&enablejsapi=1&playerapiid=embed", "embed", "425", "365", "8", null, null, params);


function play() {      
  ytplayer.playVideo();
}

function pause() {      
  ytplayer.pauseVideo();
}
function stop() {      
  ytplayer.stopVideo();
}

function newVideo() {
  ytplayer.loadVideoById('FgxwKEuy-pM', 0)
  cueVideoById
}

});


function onYouTubePlayerReady (playerID) {
  console.log('Player ready');
  embed.addEventListener('onStateChange', 'player.stateChange');
};

var player = {
  videoLength: 0,
   init: function(){
      this.renderUI();
  },
  video: '',
  stateChange: function(e){
    console.log(e + ' is player state.');

    // Playing
    if (e === 1) {
      $('#pause').show();
      $('#play').hide();
      setInterval(player.updateProgressBar, 50);
    }

    // Paused
    if (e === 2) {
      $('#pause').hide();
      $('#play').show();
      clearInterval(player.updateProgressBar)
    }

   },
   play: function(video){

      if (video) {
        this.video = video;
      } 

      if (embed.getPlayerState() === 2) {
         return embed.playVideo()
      };
      
      if (this.video === '') {
         this.video = Window.queue[0]
      };

      this.renderUI();
      embed.loadVideoById(this.video.id);
   },
   updateProgressBar: function(){
      
      var duration = player.duration;

      var currentTime = embed.getCurrentTime(),
          progress = currentTime/duration*100,
         buffered = embed.getVideoLoadedFraction()*100;

      $('#progress').width(progress + '%');
      $('#buffered').width(buffered + '%');

      var mins = Math.floor(currentTime / 60),
         seconds = util.pad(Math.floor(currentTime % 60),2);

      $('#time').text(mins + ':' + seconds);
   },
   renderUI: function () {

    player.duration = embed.getDuration();

    var totalMins = Math.floor(player.duration/60),
        totalSeconds = util.pad(Math.floor(player.duration % 60),2);

    $('#time').text('0:00');

    $('#duration').text(totalMins + ':' + totalSeconds);

    $('#title').text(player.video.snippet.title);



   }
}


$('#play').click(function(){
   player.play();
});

$('#pause').click(function(){
   embed.pauseVideo();
});

$('#previous').click(function(){
  Window.queue.unshift(Window.playHistory.shift());
  var video = Window.queue[0];
  player.play(video)
});

$('#next').click(function(){
  Window.playHistory.push(Window.queue[Window.currentSong]);
  Window.currentSong++;
  var video = Window.queue[Window.currentSong];
  player.play(video)
});

$('#bar').click(function(e){
  var xOffset = e.pageX - $(this).offset().left,
      ratio = xOffset/$(this).width(),
      seconds = Math.round(ratio*player.duration);

  embed.seekTo(seconds, true)

});

 


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