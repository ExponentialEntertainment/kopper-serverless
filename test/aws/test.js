var config = process.env.KOPPER_SERVERLESS_COV ? require('../../lib-cov/aws/config') : require('../../lib/aws/config');

exports.aws = {
	testConfigMissingCredentials: function (test) {
		test.throws(config({}, 'region-test', 'test', null));
		test.done();
	}
}
