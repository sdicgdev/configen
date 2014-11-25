var fs = require('q-io/fs'),
		Q  = require('q');

module.exports = function(file){
	this.readCredentialFile = fs.read(file),
	this.listOfRegisteredEnvVars = [];
}

module.exports.prototype.register = function(name, obj){
	this[name] = this.readCredentialFile.then(function(creds){
		creds = JSON.parse(creds);
		var t = new obj(creds[name]);
		t.patch = function(name, func){
			t['_'+name] = t[name];
			t[name] = func;
		}
		t._options = creds[name];
		return t
	});
	this.listOfRegisteredEnvVars.push(name);
	return this[name];
}

module.exports.prototype.loaded = function(injectors){
	return Q.all(injectors||this.listOfRegisteredEnvVars);
}
