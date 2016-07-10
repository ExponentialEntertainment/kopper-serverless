var AWSConfig = require('./lib/aws/config');
var LambdaError = require('./lib/error/lambda-error');
var NonFatalError = require('./lib/error/non-fatal-error');

module.exports = {
	AWS: {
		config: AWSConfig
	},
	Error: {
		NonFatalError: NonFatalError
	},
	Succeed: function (result, context, callback) {
		context.succeed(result);
	},
	Fail: function (error, code, context, callback) {
		context.fail(new LambdaError(error.toString(), code));
	}
};


