const generateSwaggerDocs = require("./generator-moduleDocsFile.js");
const generateConfigFile = require("./generator-moduleConfigFile.js");
const generateControllerFile = require("./generate-moduleControllerFile.js")
const generateModelFile = require("./generate-moduleModelFile.js");
const generateRouterFile = require("./generator-moduleRouterFile.js");

module.exports = {
	generateSwaggerDocs,
	generateConfigFile,
	generateControllerFile,
	generateModelFile,
	generateRouterFile
}