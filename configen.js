var fs = require('q-io/fs'),
		Q  = require('q')
    configen
    ;

function configen(file){
	this.readCredentialFile = fs.read(file),
	this.listOfRegisteredEnvVars = [];
}

configen.prototype.register = function(name, obj){
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

configen.prototype.loaded = function(injectors){
	return Q.all(injectors||this.listOfRegisteredEnvVars);
}

configen.generate = function(file){
  return new configen(file);
}

module.exports = configen;
