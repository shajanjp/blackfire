const helperUtilities = require('./lib.generator.js');
const generateMongooseSchema = require('./model-generateMongooseSchema.js');

module.exports = function(filePath, moduleDetails) {
  const modelFileData = `const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ${moduleDetails.singular}Schema = new Schema(${ generateMongooseSchema(moduleDetails.modelData) });

mongoose.model('${moduleDetails.singular}', ${moduleDetails.singular}Schema);`;
  helperUtilities.makeFile(filePath, modelFileData);
};
