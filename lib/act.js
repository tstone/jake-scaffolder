
var path    = require('path'),
    fs      = require('fs'),
    util    = require('./util');

var Act = function() { };
(function(act){

    act.pathy = function(p) {
        return util.pathy(p, this.config.templateDir);
    };

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
            d = this.pathy(d);
            log('Creating directory ' + d + '...');
            fs.mkdir(d);
        }
    };

    act.createFile = function(content, dest) {
        if (this.config.cont) {
            dest = this.render(this.pathy(dest), this.config);
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
            var sourceContent = fs.readFileSync(this.pathy(source));
            this.renderStringToFile(sourceContent, dest);
        }
    };

    act.renderFolder = function(source, dest) {
        if (this.config.cont) {
            fs.readdirSync(this.pathy(source)).forEach(function(f){
                this.renderFile(path.join(source, f), path.join(dest, f));
            }.bind(this));
        }
    };

    act.replaceInFile = function(source, find, repl, options) {
        if (this.config.cont) {
            source = this.pathy(source);
            var sourceContent = fs.readFileSync(source);
            var regex = new RegExp(source, options || 'g');
            sourceContent = sourceContent.replace(regex, repl);

            util.log('Updating ' + source + '...');
            var fd = fs.openSync(source, 'w');
            fs.writeSync(fd, sourceContent, 0);
        }
    };

    act.replaceInDir = function(source, find, repl, options) {
        if (this.config.cont) {
            fs.readdirSync(this.pathy(source)).forEach(function(f){
                this.replaceInFile(path.join(source, f), find, repl, options);
            }.bind(this));
        }
    };

    // TODO:
    // appendToFile
    // appendStringToFile

}(Act.prototype));

exports.Act = Act;