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
      };

      addListener();

   };

   function setCurrentView (name) {

      console.log(name);

      $('#nav a').attr('class', '');
      $("#nav a[data-view='" + name + "']").attr('class', 'selected');

      
      if (currentView) {
         currentView.hide()
      };

      currentView = views[name];
   
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
