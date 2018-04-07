const helperUtilities = require('../utilities/lib.generator.js');

module.exports = function(filePath, moduleDetails) {
  const modelFileData = `const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ${moduleDetails.singular}Schema = new Schema({
  title: String
});

mongoose.model('${moduleDetails.singular}', ${moduleDetails.singular}Schema);`;
  helperUtilities.makeFile(filePath, modelFileData);
};
