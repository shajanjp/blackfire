var homeController = require('../controllers/home.server.controller.js');
var domainRoot = '/api';

module.exports = function(app){
	app.route(domainRoot + '/')
	.get(homeController.homeAPI);
}