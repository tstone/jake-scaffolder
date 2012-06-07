
var path    = require('path'),
    fs      = require('fs'),
    util    = require('./util');

var Conf = function() { };
(function(conf){

    conf.get = function(key) {
        return this.config[key];
    };

    conf.set = function(key, val) {
        if (key === 'templateDir') {
            val = util.pathy(val);
        }
        this.config[key] = val;
    };

}(Conf.prototype));

exports.Conf = Conf;