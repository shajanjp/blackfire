var config = require('./env/'+ process.env.NODE_ENV +'.js'),
mongoose = require('mongoose');
var activeModules = require('./modules.js').activeModules;
var moduleModels;

module.exports = function(){
	var db = mongoose.connect(config.db,  {
		useMongoClient: true
	});
	console.log("registering mongoDB schemas...");
	activeModules.forEach(function(module) {
		moduleModels = require('../app/' + module.name + '/config/' + module.name + '.locals.json').models;
		if(moduleModels != undefined){
			moduleModels.forEach(function(modelFile){
				require('../app/'+ module.name + '/models/' + modelFile);
				console.log("registering " + modelFile);
			});
		}
	});
	return db;
};