module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Building

    browserify: {
      dist: {
        files: {
          'dist/scripts/<%= pkg.name %>.js': ['client/app.js'],
        },
        options: {
          debug: true,
          extensions: ['.jsx'],
          transform: ['reactify']
        }
      }
    },

    copy: {
      favicon: {
        src: 'client/favicon.ico',
        dest: 'dist/favicon.ico'
      },
      index: {
        src: 'client/index.html',
        dest: 'dist/index.html'
      },
      foundation: {
        src: 'client/css/foundation.min.css',
        dest: 'dist/built/foundation.min.css'
      },
      animationCss: {
        src: 'client/css/animation.css',
        dest: 'dist/built/animation.css'
      },
    },

    uglify: {
      dist: {
        files: {
          'dist/scripts/<%= pkg.name %>.min.js' : ['dist/scripts/<%= pkg.name %>.js']
        }
      }
    },

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/built/app.css': 'client/sass/app.scss'
        }
      }
    },

    cssmin: {
      target: {
        files: {
          'dist/stylesheets/app.css' : [ 'dist/built/*.css' ]
        }
      }
    },

    // Testing

    jshint: {
      files: ['*.js'],
      options: {
        force: 'false',
        ignores: [
          'client/bower_components/*.js',
          'dist/built/**/*.js',
          'client/js/jquery/**/*.js',
          'client/js/plugins/**/*.js',
          'client/js/angular-nouislider.js',
          'client/js/icheck.min.js'

        ]
      }
    },

    flow: {
      options: {
          style: 'color'
      },
      files: {}
    },

    // Watching
    watch: {
      scripts: {
        files: [
          './**/*.jsx',
          './client/*.js'
        ],
        tasks: [
          'browserify',
          // 'uglify',
        ]
      },
      css: {
        files: 'client/sass/*.scss',
        tasks: [
          'sass',
          'cssmin'
        ]
      }
    },

    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    nodemon: {
      dev: {
        script: 'bin/www',
        options: {
          ignore: ['node_modules/**'],
        }
      }
    },

    shell: {
      // push: {
      //   command: 'git push origin',
      //   options: {
      //     stdout: true,
      //     stderr: true
      //   }
      // }
      nodemon: {
        command: 'nodemon:dev',
        options: {
          stdout: true,
          stderr: true
        }
      }
    },
  });

  // Loads all grunt tasks
  require('load-grunt-tasks')(grunt);


  ////////////////////////////////////////////////////
  /// Grunt tasks
  ////////////////////////////////////////////////////
  
  grunt.registerTask('build', [
    // 'flow',
	// if we have to do flow we should obviously
	// ignore npm modules and shit
    'copy',
    'sass',
    'cssmin', 
    'browserify',
  ]);

  grunt.registerTask('server-dev', function (target) {

    grunt.task.run([ 'concurrent']);

  });

  grunt.registerTask('serve', [
    'build',
    'server-dev'
  ]);

  grunt.registerTask('test', [
    'flow',
    'jshint'
  ]);

};
