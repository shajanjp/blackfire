var config = require('./env/development.js'),
mongoose = require('mongoose');
var activeModules = require('./modules.js').activeModules;
var moduleModels;
module.exports = function(){
	var db = mongoose.connect(config.db);
	activeModules.forEach(function(module) {
		moduleModels = require('../app/' + module.name + '/config/' + module.name + '.locals.json').models;
		if(moduleModels != undefined)
		{
			moduleModels.forEach(function(model){
				require('../app/'+ module.name + '/models/' + model +'.server.model.js');
			});
		}
	});
	return db;
};