var nav = (function () {

   var currentView, views,
       el = '#nav';

   function init (name){
      
      // In future views should tell the nav they exist
      views = {
         starred: starred,
         discover: discover,
         queue: queue,
         songHistory: songHistory
      };

      // Load the first view
      setCurrentView(name);

      // Listen to links in the nav for click events
      $(el).on('click', 'a', function (argument) {
         var name = $(this).attr('href').slice(1);
         setCurrentView(name);
         return false
      });
   };

   function setCurrentView (name) {

      // Make sure the view exists
      if (!views[name]) {throw 'No view called' + name};

      // Close any existing views
      if (currentView) {currentView.hide()};
      
      // Save the new view so we can close it in future
      currentView = views[name];
      
      // Start new view
      currentView.init();

      // Update the nav to show we've selected a new view
      $('#nav a')
         .removeClass('selected')
         .filter("[href='#" + name + "']")
         .addClass('selected');
   };

   return {init: init};

}());
