const generateSwaggerDocs = require("./generator-moduleDocsFile.js");
const generateConfigFile = require("./generator-moduleConfigFile.js");
const generateControllerFile = require("./generate-moduleControllerFile.js")
const generateModelFile = require("./generate-moduleModelFile.js");

module.exports = {
	generateSwaggerDocs,
	generateConfigFile,
	generateControllerFile,
	generateModelFile
}