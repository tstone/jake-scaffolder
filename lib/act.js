
var path    = require('path'),
    fs      = require('fs'),
    util    = require('./util');

var Act = function() { };
(function(act){

    act.render = function(str, context) {
        for (var key in context) {
            var regex = new RegExp(config.startTag + '[\\s]*' + prop + '\\.?(lower|upper)?[\\s]*' + config.endTag, 'gi');
            var match = regex.exec(str);
            while (match) {
                var val = context[key];
                if (match[1] === 'lower') { val = val.toLowerCase(); }
                if (match[1] === 'upper') { val = val.toUpperCase(); }
                str = str.replace(m[0], val);
            }
        }
        return str;
    };

    act.mkdir = function(d) {
        if (this.config.cont) {
            d = util.pathy(d);
            log('Creating directory ' + d + '...');
            fs.mkdir(d);
        }
    };

    act.createFile = function(content, dest) {
        if (this.config.cont) {
            dest = this.render(util.pathy(dest), this.config);
            util.log('Creating ' + dest + '...');
            fs.writeFileSync(dest, content);
        }
    };

    act.createEmptyFile = function(dest) {
        this.createFile(dest, '');
    };

    act.renderStringToFile = function(str, dest) {
        if (this.config.cont) {
            str = this.render(str, this.config);
            this.createFile(dest, str);
        }
    };

    act.renderFile = function(source, dest) {
        if (this.config.cont) {
            var sourceContent = fs.readFileSync(util.pathy(source));
            this.renderStringToFile(sourceContent, dest);
        }
    };

    act.renderFolder = function(source, dest) {
        if (this.config.cont) {
            fs.readdirSync(util.pathy(source)).forEach(function(f){
                this.renderFile(path.join(source, f), path.join(dest, f));
            }.bind(this));
        }
    };

    // TODO:
    // appendToFile
    // appendStringToFile
    // replaceInFile
    // replaceInFolder

}(Act.prototype));

exports.Act = Act;