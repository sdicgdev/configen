var fs = require('q-io/fs'),
		Q  = require('q')
    configen
    ;

function configen(file){
	this.readCredentialFile = fs.read(file),
	this.listOfRegisteredEnvVars = [];
}

configen.prototype.register = function(name, obj){
  var singular
    ;

  if(!obj){
    obj = name;
    name = '_';
    singular = true;
  }

	this[name] = this.readCredentialFile.then(function(creds){
		creds = JSON.parse(creds);
		var t = new obj(singular?creds:creds[name]);
		t.patch = function(name, func){
			t['_'+name] = t[name];
			t[name] = func;
		}
		t._options = creds[name];
		return t
	})
  .catch(function(err){
    console.log(err);
    console.log(err.stack);
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
