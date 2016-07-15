module.exports = function (grunt) {
	grunt.initConfig({
		release: {
			options: {
				indentation: '\t'
			}
		},
		nodeunit: {
			all: ['test/**/*.js'],
			'all-lcov': {
				src: ['test/**/*.js'],
				options: {
					reporter: 'lcov',
					reporterOutput: './test/coverage-results.log'
				}
			}
		},
		coveralls: {
			upload: {
				src: './test/coverage-results.log'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-coveralls');
	grunt.loadNpmTasks('grunt-release');
	
	grunt.registerTask('test', ['nodeunit:all']);
	grunt.registerTask('test-lcov', ['nodeunit:all-lcov']);
	
	grunt.registerTask('publish', ['test', 'release']);
};
