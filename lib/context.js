var LambdaError = require('./error/lambda-error');

module.exports = {
	Succeed: function (result, context, callback) {
		context.succeed(result);
	},
	Fail: function (error, code, context, callback) {
		context.fail(new LambdaError(error.toString(), code));
	}
};
