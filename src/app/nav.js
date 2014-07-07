Tuuune.nav = (function () {

  var el = '#nav',
      currentView;

   function init (name){

      // Load the first view
      setView(name);

      // Listen to links in the nav for click events
      $(el).on('click', 'a', function (argument) {
         var name = $(this).attr('href').slice(1);
         setView(name);
         return false
      });
   };

   function setView (name) {

      // Make sure the view exists
      if (!Tuuune[name]) {throw 'No view called' + name};

      // Close any existing views
      if (currentView) {currentView.hide()};
      
      // Save the new view so we can close it in future
      currentView = Tuuune[name];
      
      // Show new view
      currentView.show();

      // Update the nav to show we've selected a new view
      $('#nav a')
         .removeClass('selected')
         .filter("[href='#" + name + "']")
         .addClass('selected');
   };

   return {init: init};

}());
