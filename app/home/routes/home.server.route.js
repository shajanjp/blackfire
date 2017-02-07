module.exports = function(app){
	var homeController = require('../controllers/home.server.controller.js');
	app.route('/')
	.get(homeController.home);
}