var queue = (function(){
   
   var viewId = 'queue',
       
       exports = {
         init: init,
         hide: hide
       };
   
  function init () {
      
      $('#' + viewId).show();

      // Ensure the controller listens to the UI
      bindEventHandlers();
      
      render();
   };

  function hide () {
    $('#' + viewId).hide();

    // Stop listening to click events in the view
    unbindEventHandlers();
  };

  function bindEventHandlers() {
    
    $(player).on('songChange', function(){
       render();
    });

  };

  function unbindEventHandlers () {

    $(player).off();

  };

  function render() {

    var songQueue = player.queue();
    
    console.log(songQueue);
    
    var defaultQueueHTML = songQueue.auto.render(),
        userQueueHTML = songQueue.user.render(),
        html = userQueueHTML + defaultQueueHTML;

    console.log(html);
    console.log(userQueueHTML);

    $('#' + viewId + ' .songList').html(html);

  };

  return exports

}());