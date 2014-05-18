var nav = (function () {

   var currentView,
       views,
       exports = {
         init: init,
         setCurrentView: setCurrentView
       };

   function init (name){
    
      views = {
         starred: starred,
         discover: discover,
         queue: queue,
         history: history
      };

      if (name) {
         setCurrentView(name)
      } else {
         console.log('PLEASE DEFINE A VIEW TO START WITH')
      };

      addListener();

   };

   function setCurrentView (name) {

      if (currentView) {
         currentView.hide()
      };

      currentView = views[name];
      
      console.log('current view is ' + currentView);

      currentView.init();


   };

   function addListener () {

      $('#nav a').click(function(e){

         var viewName = $(this).attr('data-view');

         setCurrentView(viewName);

      });

   };

   return exports;

}());
