var Context = process.env.KOPPER_SERVERLESS_COV ? require('../lib-cov/context') : require('../lib/context');
var NonFatalError = process.env.KOPPER_SERVERLESS_COV ? require('../lib-cov/error/non-fatal-error') : require('../lib/error/non-fatal-error');

exports.error = {
	testSucceed: function (test) {
		Context.Succeed('test', {
			succeed: function (result) {
				test.equal(result, 'test');
			},
			fail: function (error) {
				test.ok(false, 'this should have succeeded');
			}
		});

		test.done();
	},
	testFail: function (test) {
		var error = new NonFatalError('test error', 404);
		
		Context.Fail(error, error.code, {
			succeed: function (result) {
				test.ok(false, 'this should have failed');
			},
			fail: function (error) {
				test.equal(error.toString(), 'NonFatalError: test error CODE:404');
			}
		});

		test.done();
	}
}
