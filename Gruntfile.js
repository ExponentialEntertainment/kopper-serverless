module.exports = function (grunt) {
	grunt.initConfig({
		release: {
			options: {
				indentation: '\t'
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-release');
};
