//ADMIN NODE

var AdminNode = function(){
	this.a = {}
	this.http = require('http');
	this.Templater = require('./templater_v2/templater.js');
	this.init();
}

AdminNode.prototype = {
	@import 'init.js'
}

new AdminNode;