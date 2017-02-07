var config = require('./env/'+ process.env.NODE_ENV +'.js');
var express = require('express');
var compress = require('compression');
var bodyParser = require('body-parser');
var activeModules = require('./modules.js').activeModules;

module.exports = function(){
	var app = express();
	
	if (process.env.NODE_ENV == 'production') {
		app.use(compress());
	}

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	
	app.set('view engine', 'ejs');
	app.set('views', './app');

	app.locals = require('./app-config.js').moduleLocals;
	activeModules.forEach(function(module) {
		require('../app/'+ module.name + '/routes/' + module.name +'.server.route.js')(app);
	});

	app.use(express.static('./app'));
	return app;
}