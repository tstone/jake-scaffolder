
var path	= require('path');

// :: error ::
var error = exports.error = function(s) {
	console.log('\n' + s.split('\n').map(function(x){ return '  =>  ' + s; }).join('\n'));
};

// :: log ::
var log = exports.log = function(s) {
    console.log('  ::  ' + s);
};

// :: getParetPath ::
var getParentPath = exports.getParentPath = function() {
	var p = function(mod) {
		return mod.parent ? p(mod.parent) : mod;
	};
	var parentFile = p(module).filename;
	return path.dirname(parentFile);
};

// :: pathy ::
var pathy = exports.pathy = function(p) {
    if (p.substr(0,2) === './') {
        return path.join(getParentPath(), p.substr(2));
    } else {
        return p;
    }
};