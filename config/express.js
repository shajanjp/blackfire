let config = require('./env');
var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var activeModules = require('./modules.js').activeModules;
var mainRoutes = express.Router();
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.js');

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

	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

	console.log('loading routes...');
	activeModules.forEach(function(module) {
		moduleRoutes = require('../app/' + module.name + '/config/' + module.name + '.config.json').routes;
		if(moduleRoutes != undefined){
			moduleRoutes.forEach(function(routeFile){
				mainRoutes.use(module.root, require('../app/'+ module.name + '/routes/' + routeFile));
				console.log("loading " + routeFile);
			});
		}
	});
	
	app.use('/api', mainRoutes);

	return app;
}