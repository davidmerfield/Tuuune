var queue = (function(){
   
   var viewId = 'queue',
       
       songQueue,

       exports = {
         init: init,
         hide: hide
       };
   
  function init () {

      songQueue = player.queue();

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

    if (!songQueue) {return}
      
    $('#userqueue').html(songQueue.user.render());
    $('#defaultqueue').html(songQueue.auto.render());

  };

  return exports

}());