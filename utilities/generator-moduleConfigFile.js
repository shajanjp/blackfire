const helperUtilities = require('./lib.generator.js');

module.exports = function(filePath, moduleDetails) {
  const configData = `{
  "name" : "${moduleDetails.plural}",
  "title" : "${moduleDetails.pluralCamel}",
  "description" : "${moduleDetails.pluralCamel} will be ${moduleDetails.plural} !",
  "routes": ["${moduleDetails.plural}.server.route.js"],
  "models": ["${moduleDetails.plural}.server.model.js"],
  "root": "/${moduleDetails.plural}"
}`;
  helperUtilities.makeFile(filePath, configData);
};
