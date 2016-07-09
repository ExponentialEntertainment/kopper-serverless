var _ = require('underscore');
var AWS = require('aws-sdk');
var ApiGateway = require('../aws/api-gateway');

module.exports = {
	buildLambdaInvoke: function (folder, names) {
		var config = {};

		_.each(names, function (name) {
			config[name] = {
				options: {
					file_name: folder + '/' + name + '/index.js',
					event: folder + '/' + name + '/event.json'
				}
			};
		});

		return config;
	},
	buildLambdaPackage: function (folder, names) {
		var config = {};

		_.each(names, function (name) {
			config[name] = {
				options: {
					include_time: false,
					package_folder: folder + '/' + name,
					dist_folder: folder + '/' + name + '/dist'
				}
			};
		});

		return config;
	},
	buildLambdaDeploy: function (profile, region, account, prefix, names) {
		var config = {};

		_.each(names, function (name) {
			config[name] = {
				options: {
					profile: profile
				},
				arn: 'arn:aws:lambda:' + region + ':' + account + ':function:' + (prefix ? prefix + '-' : '') + name
			};
		});

		return config;
	},
	buildLambdaTest: function (names) {
		var config = {
			api: _.map(names, function (name) {
				return 'test/lambda/' + name + '/test.js';
			})
		};

		_.each(names, function (name) {
			config[name] = 'test/lambda/' + name + '/test.js';
		});

		return config;
	},
	addLambdas: function (config, profile, region, account, folder, prefix, names) {
		config.lambda_invoke = this.buildLambdaInvoke(folder, names);
		config.lambda_package = this.buildLambdaPackage(folder, names);
		config.lambda_deploy = this.buildLambdaDeploy(profile, region, account, prefix, names);
		config.nodeunit.api = this.buildLambdaTest(names);
	},
	registerLambdaTasks: function (grunt, names, preDeployTasks, postDeployTasks) {
		grunt.loadNpmTasks('grunt-contrib-nodeunit');
		grunt.loadNpmTasks('grunt-aws-lambda');

		_.each(names, function (name) {
			grunt.registerTask('run-' + name, ['lambda_invoke:' + name]);
			grunt.registerTask('deploy-' + name, ['lambda_package:' + name, 'lambda_deploy:' + name]);
			grunt.registerTask('test-' + name, ['nodeunit:' + name]);
		});

		grunt.registerMultiTask('apiDefinition', 'deploys a swagger api', function () {
			ApiGateway.deploy(this, grunt, AWS);
		});

		grunt.registerTask('deploy-api-definition', 'apiDefinition:deploy');
		grunt.registerTask('deploy-api', _.flatten([preDeployTasks, 'nodeunit:api', _.map(names, function (name) {
				return 'deploy-' + name;
			}), 'deploy-api-definition', postDeployTasks]));
	}
}