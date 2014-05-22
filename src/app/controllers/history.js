var history = (function(){
   
   var viewId = 'history',
       
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

    var songHistory = player.history;
        songHistoryHTML = songHistory.render();

    $('#history .songList').html(songHistoryHTML);

  };

  return exports

}());