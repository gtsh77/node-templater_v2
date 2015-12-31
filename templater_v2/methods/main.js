//TEMPLATER

module.exports = function(opts){
	this.config = {
		templaterDir: '',
		debugTemplates: 0
	};
	this.EventEmitter = require('events').EventEmitter;
	this.reader = require('line-reader');
	this.extend = require('extend');
	this.extend(this.config,opts);
}

module.exports.prototype = {
	@import 'render.js'
}