var Grunt = require('./lib/grunt/grunt');
var Test = require('./lib/test/test');
var AWSConfig = require('./lib/aws/config');
var AWSApiGateway = require('./lib/aws/api-gateway');
var LambdaError = require('./lib/error/lambda-error');
var NonFatalError = require('./lib/error/non-fatal-error');

module.exports = {
	Grunt: Grunt,
	Test: Test,
	AWS: {
		config: AWSConfig,
		ApiGateway: AWSApiGateway
	},
	Error: {
		NonFatalError: NonFatalError
	},
	Succeed: function (result, context, callback) {
		context.succed(result);
	},
	Fail: function (error, code, context, callback) {
		context.fail(new LambdaError(error.toString(), code));
	}
};


