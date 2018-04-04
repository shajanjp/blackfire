const config = require('./env/');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const activeModules = require('./modules.js').activeModules;

let moduleModels;

module.exports = function () {
  const db = mongoose.connect(config.db.url, {
    useMongoClient: true,
  });

  console.log(`using mongodb at ${config.db.url}`);
  console.log('registering mongoose schemas...');
  activeModules.forEach((module) => {
    moduleModels = require(`../app/${module.name}/config/${module.name}.config.json`).models;
    if (moduleModels !== undefined && moduleModels.length > 0) {
      moduleModels.forEach((modelFile) => {
        require(`../app/${module.name}/models/${modelFile}`);
        console.log(`registering ${modelFile}`);
      });
    }
  });
  return db;
};
