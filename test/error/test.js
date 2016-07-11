var LambdaError = require('../../lib/error/lambda-error');
var NonFatalError = require('../../lib/error/non-fatal-error');

exports.error = {
	testLambdaError: function(test){
		var error = new LambdaError('test', 400);
		test.ok(error.toString().indexOf('CODE:') > 0);
		
		test.done();
	},
	testNonFatalError: function(test){
		var error = new NonFatalError('test', 100);
		test.equal(error.code, 100);
		
		test.done();
	},
	testNonFatalErrorDefaultCode: function(test){
		var error = new NonFatalError('test');
		test.equal(error.code, 400);
		
		test.done();
	}
}