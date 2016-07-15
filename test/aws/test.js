var config = process.env.KOPPER_SERVERLESS_COV ? require('../../lib-cov/aws/config') : require('../../lib/aws/config');

exports.aws = {
	testConfigIsLocal: function (test) {
		test.doesNotThrow(function () {
			config({isLocal: true}, 'region-test', 'test', {
				config: {},
				SharedIniFileCredentials: function () {}
			});
		});

		test.done();
	},
	testConfigHasCredentials: function (test) {
		test.doesNotThrow(function () {
			config({hasCredentials: true, accessKeyId: 'test', secretAccessKey: 'test'}, 'region-test', 'test', {
				config: {
					update: function(){}
				}
			});
		});

		test.done();
	},
	testConfigMissingCredentials: function (test) {
		test.throws(function () {
			config({hasCredentials: true}, 'region-test', 'test', null);
		});

		test.done();
	}
}
