var Path = require('path');
var OS = require('os');
var AWS = require('aws-sdk');
var NonFatalError = require('../error/non-fatal-error');

module.exports = function (event, region, profile, ParentAWS) {
	if (event.isLocal === true) {
		AWS.config.credentials = new AWS.SharedIniFileCredentials({filename: Path.join(OS.homedir(), '.aws', 'credentials'), profile: profile});
		AWS.config.region = region;

		if (ParentAWS) {
			ParentAWS.config.credentials = AWS.config.credentials;
			ParentAWS.config.region = AWS.config.region;
		}
	} else if (event.hasCredentials) {
		if (event.accessKeyId && event.secretAccessKey) {
			AWS.config.update({
				accessKeyId: event.accessKeyId,
				secretAccessKey: event.secretAccessKey,
				region: region
			});

			if (ParentAWS) {
				ParentAWS.config.credentials = AWS.config.credentials;
				ParentAWS.config.region = AWS.config.region;
			}
		} else {
			throw new NonFatalError('missing credentials');
		}
	}
}