module.exports = {
	ok: function (dir, name, test, event, context) {
		var lambda = require(dir + '/' + name + '/index');

		if (!context) {
			context = {
				succeed: function (response) {
					test.ok(response, 'there is a response');
					test.done();
				},
				fail: function (error) {
					test.ok(false, error.toString());
					test.done();
				}
			};
		}

		if (!event) {
			event = require(dir + '/' + name + '/event');
		}

		lambda.handler(event, context);
	},
	fail: function (dir, name, test, event, context) {
		this.ok(dir, name, test, event, context ? context : {
			succeed: function (response) {
				test.ok(false, 'this should have failed');
				test.done();
			},
			fail: function (error) {
				test.ok(error, error.toString());
				test.done();
			}
		});
	}
}
