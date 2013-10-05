module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		//	validate JS
		jshint: {
			all: [
				"Gruntfile.js", "src/**/*.js", "test/spec/*.js"
			],
			options : {
                jshintrc : '.jshintrc'
            }
		},
		//	concat
		concat: {
			options: {
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				// define a string to put between each file in the concatenated output
				separator: ';'
			},
			dist: {
				src: 'src/**/*.js',
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		//	minify
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'dist/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		//  jasmine
		jasmine: {
			src: 'src/**/*.js',
			options: {
				specs: 'test/**/*Spec.js'
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('test', ['jshint', 'jasmine']);
	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};