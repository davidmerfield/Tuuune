var songHistory = (function(){
   
   var viewId = 'history',
      
      songHistory,

       exports = {
         init: init,
         hide: hide
       };
   
  function init () {
      
    songHistory = player.history;

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

    Song.addListener(viewId, songHistory, {noDefaultQueue: true});

  };

  function unbindEventHandlers () {
    $(player).off();
    Song.removeListener(viewId);
  };

  function render() {

    var songHistoryHTML = songHistory.render();

    $('#history .songList').html(songHistoryHTML);

  };

  return exports

}());