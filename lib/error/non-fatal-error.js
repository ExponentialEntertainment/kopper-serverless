var NonFatalError = function(message, code) {
  this.name = 'NonFatalError';
  this.message = message;
	this.code = code || 400;
}

NonFatalError.prototype = Object.create(Error.prototype);
NonFatalError.prototype.constructor = NonFatalError;

module.exports = NonFatalError;
