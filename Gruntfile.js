/*
* Gruntfile.js file serving as task manager
*/
module.exports = function(grunt) {

//Initialize grunt configuration
  grunt.initConfig({

    // configure nodemon
    nodemon: {
      dev: {
        script: 'app.js'
      }
    },

    // configure less to css 
    less : {
      dev : {
        options : {
          compress : false,   // Compress output by removing some whitespaces.
          optimization : 2,  // Set the parser's optimization level. The lower the number, the less nodes it will create in the tree. 
          ieCompat : true    // Enforce the CSS output is compatible with Internet Explorer 8.
        },
        files : {
          "client/css/style.css" : "client/css/style.less"  // destination file and source file
        }
      }
    }

  });

  // load nodemon
  grunt.loadNpmTasks('grunt-nodemon');
  // load less
  grunt.loadNpmTasks('grunt-contrib-less');

  // register the nodemon task when we run grunt
  grunt.registerTask('default', ['nodemon', 'less']);  

};
