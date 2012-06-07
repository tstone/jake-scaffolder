
var path    = require('path'),
    fs      = require('fs'),
    util    = require('./util');

var Need = function() { };
(function(need){

    need.exists = function(f) {
        if (this.config.cont) {
            f = util.pathy(f);
            if (!path.existsSync(f)) {
                util.error(f + ' must exist. Qutting.');
                this.config.cont = false;
            }
        }
    };

    need.fileExists = function(f) {
        this.exists(f);
    };

    need.dirExists = function(d) {
        this.exists(d);
    };

    need.doesntExist = function(f) {
        if (this.config.cont) {
            f = util.pathy(f);
            if (path.existsSync(f)) {
                util.error(f + ' already exists. Qutting.');
                this.config.cont = false;
            }
        }
    };

    need.fileDoesntExist = function(f) {
        this.doesntExist(f);
    };

    need.dirDoesntExist = function(d) {
        this.doesntExist(d);
    };

    need.dirEmpty = function(d) {
        if (this.config.cont) {
            d = util.pathy(d);
            if (fs.readdirSync(d).length > 0) {
                util.error(d + ' is not empty. Quitting.');
                this.config.cont = false;
            }
        }
    };

    need.dirNotEmpty = function(d) {
        if (this.config.cont) {
            d = util.pathy(d);
            if (fs.readdirSync(d).length > 0) {
                util.error(d + ' is not empty. Quitting.');
                this.config.cont = false;
            }
        }
    };

}(Need.prototype));

exports.Need = Need;