var _ = require('underscore');
var Promise = require('bluebird');

module.exports = {
	defaultResponses: {
		200: {
			description: '200 response',
			schema: {
				'$ref': '#/definitions/Empty'
			},
			headers: {
				'Access-Control-Allow-Origin': {
					type: 'string'
				}
			}
		},
		400: {
			description: '400 response',
			schema: {
				'$ref': '#/definitions/Empty'
			},
			headers: {
				'Access-Control-Allow-Origin': {
					type: 'string'
				}
			}
		},
		401: {
			description: '401 response',
			schema: {
				'$ref': '#/definitions/Empty'
			},
			headers: {
				'Access-Control-Allow-Origin': {
					type: 'string'
				}
			}
		},
		403: {
			description: '403 response',
			schema: {
				'$ref': '#/definitions/Empty'
			},
			headers: {
				'Access-Control-Allow-Origin': {
					type: 'string'
				}
			}
		},
		404: {
			description: '404 response',
			schema: {
				'$ref': '#/definitions/Empty'
			},
			headers: {
				'Access-Control-Allow-Origin': {
					type: 'string'
				}
			}
		},
		500: {
			description: '500 response',
			schema: {
				'$ref': '#/definitions/Empty'
			},
			headers: {
				'Access-Control-Allow-Origin': {
					type: 'string'
				}
			}
		}
	},
	defaultIntegrationResponses: {
		'.*(CODE\\:404)': {
			statusCode: '404',
			responseParameters: {
				'method.response.header.Access-Control-Allow-Origin': '\'*\''
			}
		},
		'default': {
			statusCode: '200',
			responseParameters: {
				'method.response.header.Access-Control-Allow-Origin': '\'*\''
			}
		},
		'.*(CODE\\:500)': {
			statusCode: '500',
			responseParameters: {
				'method.response.header.Access-Control-Allow-Origin': '\'*\''
			}
		},
		'.*(CODE\\:401)': {
			statusCode: '401',
			responseParameters: {
				'method.response.header.Access-Control-Allow-Origin': '\'*\''
			}
		},
		'.*(CODE\\:403)': {
			statusCode: '403',
			responseParameters: {
				'method.response.header.Access-Control-Allow-Origin': '\'*\''
			}
		},
		'.*(CODE\\:400)': {
			statusCode: '400',
			responseParameters: {
				'method.response.header.Access-Control-Allow-Origin': '\'*\''
			}
		}
	},
	buildOptions: function (methods) {
		return {
			consumes: [
				'application/json'
			],
			produces: [
				'application/json'
			],
			responses: {
				200: {
					description: '200 response',
					schema: {
						'$ref': '#/definitions/Empty'
					},
					headers: {
						'Access-Control-Allow-Origin': {
							type: 'string'
						},
						'Access-Control-Allow-Methods': {
							type: 'string'
						},
						'Access-Control-Allow-Headers': {
							type: 'string'
						}
					}
				}
			},
			'x-amazon-apigateway-integration': {
				responses: {
					'default': {
						statusCode: '200',
						responseParameters: {
							'method.response.header.Access-Control-Allow-Methods': '\'' + methods.join(',').toUpperCase() + '\'',
							'method.response.header.Access-Control-Allow-Headers': '\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'',
							'method.response.header.Access-Control-Allow-Origin': '\'*\''
						}
					}
				},
				requestTemplates: {
					'application/json': '{"statusCode": 200}'
				},
				type: 'mock'
			}
		}
	},
	buildApiGatewayIntegration: function (region, account, lambda, requestTemplate) {
		var integration = {
			responses: this.defaultIntegrationResponses,
			httpMethod: 'POST',
			uri: 'arn:aws:apigateway:' + region + ':lambda:path/2015-03-31/functions/arn:aws:lambda:' + region + ':' + account + ':function:' + lambda + '/invocations',
			type: 'aws'
		};

		if (requestTemplate) {
			integration.requestTemplates = {
				'application/json': requestTemplate
			};
		}

		return integration;
	},
	buildMethod: function (region, account, consumes, lambda, parameters) {
		var method = {
			produces: [
				'application/json'
			],
			responses: this.defaultResponses
		};

		if (consumes) {
			method.consumes = [
				'application/json'
			];
		}

		var requestTemplate;

		if (parameters) {
			method.parameters = parameters;

			requestTemplate = JSON.stringify(_.object(_.map(parameters, function (parameter) {
				return [parameter.name, '$input.params(\'' + parameter.name + '\')'];
			})));
		}

		method['x-amazon-apigateway-integration'] = this.buildApiGatewayIntegration(region, account, lambda, requestTemplate);

		return method;
	},
	buildEndpoint: function (region, account, endpoints) {
		var self = this;

		var methods = _.mapObject(endpoints, function (endpoint) {
			return self.buildMethod(region, account, endpoint.consumes, endpoint.lambda, endpoint.parameters);
		});

		methods.options = this.buildOptions(_.keys(methods).concat('options'));

		return methods;
	},
	buildApi: function (region, account, host, title, paths) {
		var self = this;

		return {
			swagger: '2.0',
			info: {
				version: Date.now(),
				title: title
			},
			host: host,
			basePath: '/prod',
			schemes: [
				'https'
			],
			paths: _.mapObject(paths, function (endpoints) {
				return self.buildEndpoint(region, account, endpoints);
			}),
			definitions: {
				Empty: {
					type: 'object'
				}
			}
		};
	},
	deploy: function (self, grunt, AWS) {
		var done = self.async();

		var apiGateway = Promise.promisifyAll(new AWS.APIGateway());
		var apiDefinition = require(process.cwd() + '/' + self.data.api);

		apiGateway.putRestApiAsync({
			restApiId: self.data.restApiId,
			body: JSON.stringify(this.buildApi(apiDefinition.region, apiDefinition.account, apiDefinition.domain, apiDefinition.name, apiDefinition.api)),
			mode: 'overwrite',
			failOnWarnings: true
		}).then(function (uploadResponse) {
			grunt.log.ok('uploaded ' + uploadResponse.name + ' (' + uploadResponse.id + ')');

			return apiGateway.createDeploymentAsync({
				restApiId: self.data.restApiId,
				stageName: self.data.stageName,
			}).then(function (deploymentResponse) {
				grunt.log.ok('deployed ' + uploadResponse.name + ' (' + deploymentResponse.id + ')');
			});
		}).catch(function (error) {
			console.error(error);
		}).finally(done);
	},
	output: function (context, apiResponse, status) {
		context.response.headers['content-type'] = 'application/json';

		if (apiResponse) {
			context.response.headers['status'] = status || 200;
			context.write(JSON.stringify(apiResponse));
		} else {
			context.response.headers['status'] = status || 500;
			context.response.sendHeaders();
			process.exit();
		}
	},
	route: function (context, dir, file) {
		var self = this;

		var apiDefinition = require(dir + '/' + file);

		var endpoint = apiDefinition.api[context.request.url.path];
		var event = {};

		if (!endpoint) {
			//search via regex

			_.each(apiDefinition.api, function (testEndpoint, path) {
				var regex = new RegExp(path.replace(/\{(.+)\}/g, '(.+)'));

				if (regex.test(context.request.url.path) === true) {
					endpoint = testEndpoint;

					var names = path.match(/\{(.+)\}/);
					var values = regex.exec(context.request.url.path);

					event = _.object(_.rest(names), _.rest(values));
				}
			});
		}

		var method = context.request.method.toLowerCase();

		if (endpoint && method === 'options') {
			this.output(context, null, 200);
		} else {
			var name = endpoint ? endpoint[method] : null;

			if (name) {
				if (method === 'post' || method === 'put') {
					event = _.extend(event, JSON.parse(context.request.post.data));
				}

				var lambda = require(dir + '/' + name.lambda.replace(apiDefinition.name + '-', '') + '/index');
				lambda.handler(_.extend(event, {
					isLocal: true
				}), {
					succeed: function (response) {
						self.output(context, response);
					},
					fail: function (error) {
						self.output(context, error, error.code);
					}
				});
			} else {
				self.output(context, null, 404);
			}
		}
	}
};


