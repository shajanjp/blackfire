const helperUtilities = require('../utilities/lib.generator.js');

function generateModelFile(filePath, moduleDetails) {
  const modelFileData = `const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ${moduleDetails.singular}Schema = new Schema({
  title: String
});

mongoose.model('${moduleDetails.singular}', ${moduleDetails.singular}Schema);`;
  helperUtilities.makeFile(filePath, modelFileData);
}


module.exports = {
  generateModelFile,
};
