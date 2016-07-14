module.exports = function (grunt) {
	grunt.initConfig({
		release: {
			options: {
				indentation: '\t'
			}
		},
		nodeunit: {
			all: ['test/**']
		},
		'nodeunit-lcov': {
			all: ['test/**'],
			options: {
				reporter: 'lcov'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-release');
};
