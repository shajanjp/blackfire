var config = require('./env/'+ process.env.NODE_ENV +'.js');
var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var activeModules = require('./modules.js').activeModules;

module.exports = function(){
	var app = express();
	if(process.env.NODE_ENV === 'development'){
		app.use(morgan('dev'));
	} else if(process.env.NODE_ENV === 'production'){
		app.use(compress());
	}

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(cookieParser());

	// Loading routes.
	console.log("loading routes...");
	activeModules.forEach(function(module) {
		moduleRoutes = require('../app/' + module.name + '/config/' + module.name + '.locals.json').routes;
		if(moduleRoutes != undefined){
			moduleRoutes.forEach(function(routeFile){
				require('../app/'+ module.name + '/routes/' + routeFile)(app);
				console.log("loading " + routeFile);
			});
		}
	});

	app.use(express.static('./app'));
	return app;
}