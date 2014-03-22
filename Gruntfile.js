module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        express: {
            options: {
              // Override defaults here
            },
            dev: {
              options: {
                script: 'app.js'
              }
            }
        },
		sass: {
			dist: {
				files: {
					'public/stylesheets/register.css' : 'sass/register.scss',
					'public/stylesheets/welcome.css' : 'sass/welcome.scss',
					'public/stylesheets/common.css' : 'sass/common.scss',
					'public/stylesheets/index.css' : 'sass/index.scss',
					'public/stylesheets/login.css' : 'sass/login.scss',
					'public/stylesheets/team.css' : 'sass/team.scss',
					'public/stylesheets/invite.css' : 'sass/invite.scss'
				}
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass'],
				options: {
		          livereload: true,
		        },
			},
      express: {
        files:  [ '**/*.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          spawn: false 
        }
    	}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

	grunt.registerTask('default',['express:dev','watch']);
}
