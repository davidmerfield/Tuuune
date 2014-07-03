module.exports = function(grunt) {

   // Project configuration.
   grunt.initConfig({
      watch: {
         js: {
            files:  [ 'src/**/*.js' ],
            tasks:  [ 'uglify' ]
         }
      },
      uglify: {
         my_target: {
            options: {
               beautify: true
            },
            files: {
               'public/js/app.js': [
                  'src/libraries/**/*.js',
                  'src/init.js',
                  'src/util/**/*.js',
                  'src/app/**/*.js'
               ]
            }
         }
      }
   });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

   //  watch
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'watch']);

};