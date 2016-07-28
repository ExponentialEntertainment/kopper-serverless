var AWSConfig = require('./lib/aws/config');
var NonFatalError = require('./lib/error/non-fatal-error');
var Context = require('./lib/context');

module.exports = {
	AWS: {
		config: AWSConfig
	},
	Error: {
		NonFatalError: NonFatalError
	},
	Succeed: Context.Succeed,
	Fail: Context.Fail
};


