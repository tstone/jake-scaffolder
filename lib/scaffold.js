
var util	= require('./util'),
	Act		= require('./act').Act,
	Need	= require('./need').Need,
	Conf	= require('./conf').Conf;

exports.scaffold = function(callback){
	var act		= new Act(),
		need	= new Need(),
		conf	= new Conf();

	act.__proto__.config = need.__proto__.config = conf.__proto__.config = {
		cont: true,
		startTag: '\\[',
		endTag: '\\]'
	};
	callback(act, need, conf);
};