var homeController = require('../controllers/home.server.controller.js');
var domainRoot = '';

module.exports = function(app){
	app.route(domainRoot + '/')
	.get(homeController.homeUI);
}