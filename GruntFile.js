module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Building

    browserify: {
      dist: {
        files: {
          'public/scripts/<%= pkg.name %>.js': ['client/app.js'],
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
        dest: 'public/favicon.ico'
      },
      index: {
        src: 'client/index.html',
        dest: 'public/index.html'
      }
    },

    uglify: {
      dist: {
        files: {
          'public/scripts/<%= pkg.name %>.min.js' : ['public/scripts/<%= pkg.name %>.js']
        }
      }
    },

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'client/built/app.css': 'client/sass/*.scss'
        }
      }
    },

    cssmin: {
      target: {
        files: {
          'public/stylesheets/app.css' : ['client/built/app.css']
        }
      }
    },

    // Testing

    jshint: {
      files: ['client/js/*.js', 'client/components/**/*.js'],
      options: {
        force: 'false',
        jshintrc: 'test/.jshintrc',
        ignores: [
          'client/bower_components/*.js',
          'client/built/**/*.js',
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
  
  grunt.registerTask('copy-all', ['copy:index', 'copy:favicon']);

  grunt.registerTask('build', [
    // 'flow',
	// if we have to do flow we should obviously
	// ignore npm modules and shit
    'sass',
    'cssmin', 
    'browserify',
    'copy-all'
  ]);

  grunt.registerTask('server-dev', function (target) {

    grunt.task.run([ 'concurrent']);

  });

  grunt.registerTask('serve', [
    'build',
    'server-dev'
  ]);

  grunt.registerTask('test', [
    'jshint'
  ]);

};
