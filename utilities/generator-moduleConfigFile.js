const helperUtilities = require('./lib.generator.js');

module.exports = function(filePath, moduleDetails) {
  const configData = `{
  "name" : "${moduleDetails.plural}",
  "title" : "${moduleDetails.pluralCamel}",
  "description" : "${moduleDetails.pluralCamel} will be ${moduleDetails.plural} !",
  "apiRoutes": ["${moduleDetails.plural}.server.api.route.js"],
  "uiRoutes": ["${moduleDetails.plural}.server.ui.route.js"],
  "models": ["${moduleDetails.plural}.server.model.js"],
  "root": "/${moduleDetails.plural}"
}`;
  helperUtilities.makeFile(filePath, configData);
};
