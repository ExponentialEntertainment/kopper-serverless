var config = require('../../lib/aws/config');

exports.aws = {
	testConfigMissingCredentials: function (test) {
		test.throws(config({}, 'region-test', 'test', null));
		test.done();
	}
}
