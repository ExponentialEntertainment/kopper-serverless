module.exports = function (grunt) {
	grunt.initConfig({
		release: {
			options: {
				indentation: '\t'
			}
		},
		nodeunit: {
			all: ['test/**'],
			'all-lcov': {
				src: ['test/**'],
				options: {
					reporter: 'lcov',
					reporterOutput: 'coverage-results.txt'
				}
			}
		},
		coveralls: {
			upload: {
				src: 'coverage-results.txt',
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-coveralls');
	grunt.loadNpmTasks('grunt-release');
};
