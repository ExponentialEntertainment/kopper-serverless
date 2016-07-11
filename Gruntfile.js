module.exports = function (grunt) {
	grunt.initConfig({
		release: {
			options: {
				indentation: '\t'
			}
		},
		nodeunit: {
			all: ['test/**']
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-release');
};
