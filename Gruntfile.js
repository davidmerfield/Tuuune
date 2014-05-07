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
               mangle: false,
               beautify: true
            },
            files: {
               'public/js/libraries.js': [
                  'src/libraries/*.js',
               ],
               'public/js/app.js': [
                  'src/util/*.js',
                  'src/app/models/*.js',
                  'src/app/views/*.js',
                  'src/app/controllers/*.js',
                  'src/init.js'
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