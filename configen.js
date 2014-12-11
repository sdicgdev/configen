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
    if(!singular){
      creds = creds[name];
    }
		var t = new obj(creds);
		t.patch = function(name, func){
			t['_'+name] = t[name];
			t[name] = func;
		}
		t._options = creds;
		return t
	})
  .catch(function(err){
    console.log("configen.js", "line 35");
    console.log(err.message);
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
