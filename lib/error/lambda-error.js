var LambdaError = function (message, code) {
	this.message = message;
	this.code = code;
}

LambdaError.prototype.toString = function () {
	return this.message + ' CODE:' + this.code;
}

module.exports = LambdaError;
