module.exports = function() {
	var bkfd2Password = require('pbkdf2-password')
	var hasher  = bkfd2Password()

	return hasher
}
