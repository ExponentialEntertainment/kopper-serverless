var Path = require('path');
var OS = require('os');
var NonFatalError = require('../error/non-fatal-error');

module.exports = function (event, region, profile, AWS) {
	if (event.isLocal === true) {
		AWS.config.credentials = new AWS.SharedIniFileCredentials({filename: Path.join(OS.homedir(), '.aws', 'credentials'), profile: profile});
		AWS.config.region = region;
	} else if (event.hasCredentials) {
		if (event.accessKeyId && event.secretAccessKey) {
			AWS.config.update({
				accessKeyId: event.accessKeyId,
				secretAccessKey: event.secretAccessKey,
				region: region
			});
		} else {
			throw new NonFatalError('missing credentials');
		}
	}
}