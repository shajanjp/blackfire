#!/usr/bin/env node
const fs = require('fs');
const modulesDir = 'app';
const modulesListPath = 'config/modules.json';
const http = require('follow-redirects').http;
const https = require('follow-redirects').https;
const githubRoot = "https://github.com/shajanjp/blackfire/raw/master/";
let moduleDetails = {};

if(process.argv[2] == "init"){
	makeServerJsFile();
	makePackageJsonFile();
	makeGitIgnoreFile();
	makeExpressJsFile();
	makeMongooseJsFile();
	makeSwaggerJsFile();
	makeModulesJsonFile();
	makeModulesJsFile();
	makeEnvFiles();
	makeEnvIndexJsFile();
	makeFolder("app");
	return console.log("Success!");
}

if(process.argv.length == 5 && process.argv[2] == "module"){
	moduleDetails.singular = process.argv[3];
	moduleDetails.plural = process.argv[4];
	moduleDetails.singularCamel = moduleDetails.singular.charAt(0).toUpperCase() + moduleDetails.singular.slice(1);
	moduleDetails.pluralCamel = moduleDetails.plural.charAt(0).toUpperCase() + moduleDetails.plural.slice(1);

	makeModuleFilesAndFolders(moduleDetails.singular, moduleDetails.plural);
} else {
	console.log('Error in usage.');
	console.log('Usage: blackfire "cars" "car" "cars"');
}

function githubDownload(localFile, remoteFile) {
	https.get(`${githubRoot}${remoteFile}`, function (response) {
		response.on('data', function (data) {
			fs.writeFile(localFile, data, 'utf8', function(err){
				if(!err)
					console.log(`File ${localFile} created.`);
				else
					console.error(`Couldn't download ${localFile}`);
			});
		});
	})
	.on('error', function (err) {
		console.error(`Couldn't download ${localFile}`);
	});
}

function makeFolder(folderPath) {
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath);
		console.log(`Folder ${folderPath} created.`);
	}
}

function makeFile(filePath, content) {
	fs.writeFile(filePath, content, (err) => {
		if (err) throw err;
		console.log(`File ${filePath} created.`);
	});
}

function generateConfigFile(filePath, moduleName, moduleSingular) {
	let moduleTitle = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
	let configData = `{
	"name" : "${moduleName.toLowerCase()}",
	"title" : "${moduleTitle}",
	"description" : "${moduleTitle} will be ${moduleName.toLowerCase()} !",
	"routes": ["${moduleName.toLowerCase()}.server.route.js"],
	"models": ["${moduleName.toLowerCase()}.server.model.js"],
	"root": "/${moduleName.toLowerCase()}"
}`;
	makeFile(filePath, configData);
}

function generateControllerFile(filePath) {
	let controllerData = `exports.home = function(req, res) {
	return res.status(200).json({ "sucess": true });
}`;
	makeFile(filePath, controllerData);
}

function generateRouterFile(filePath, moduleName, moduleSingular) {
	let routerData = `const express = require('express');
const router = express.Router();
const ${moduleSingular}Controller = require('../controllers/${moduleName}.server.controller.js');

router.route('/')
.get(${moduleSingular}Controller.home);

module.exports = router;
`;
	makeFile(filePath, routerData);
}

function addModuleToList(modulePlural) {
	let moduleTitle = modulePlural.charAt(0).toUpperCase() + modulePlural.slice(1);
	modulePlural = modulePlural.toLowerCase();

	let moduleDataItem = {
		"name": modulePlural,
		"title": moduleTitle,
		"root": `/${modulePlural}`
	};

	fs.readFile(modulesListPath, 'utf8', (err, content) => {
		if (err) throw err;
		let modulesList = JSON.parse(content);
		modulesList.push(moduleDataItem);
		makeFile(modulesListPath, JSON.stringify(modulesList, null, 2));
		console.log(`Module added to modulesListPath`);
	});
}

function makeModuleFilesAndFolders(moduleSingular, modulePlural) {
	let moduleRoot = `${modulesDir}/${modulePlural}`;
	makeFolder(`${moduleRoot}`);
	makeFolder(`${moduleRoot}/config`);
	makeFolder(`${moduleRoot}/controllers`);
	makeFolder(`${moduleRoot}/libraries`);
	makeFolder(`${moduleRoot}/models`);
	makeFolder(`${moduleRoot}/routes`);
	makeFolder(`${moduleRoot}/docs`);

	generateConfigFile(`${moduleRoot}/config/${modulePlural}.config.json`, modulePlural, moduleSingular); 
	generateControllerFile(`${moduleRoot}/controllers/${modulePlural}.server.controller.js`);
	makeFile(`${moduleRoot}/libraries/${modulePlural}.server.library.js`, ""); 
	makeFile(`${moduleRoot}/models/${modulePlural}.server.model.js`, ""); 
	generateRouterFile(`${moduleRoot}/routes/${modulePlural}.server.route.js`, modulePlural, moduleSingular); 
	addModuleToList(modulePlural)
}

function makePackageJsonFile(appName){
	githubDownload("package.json", "blackfire-package.json");
}

function makeGitIgnoreFile(){
	githubDownload('.gitignore', ".gitignore");
}

function makeServerJsFile(){
	githubDownload("server.js", "server.js");
}


function makeExpressJsFile() {
	makeFolder("config");
	githubDownload("config/express.js", "config/express.js");
}


function makeModulesJsFile(){
	makeFolder("config");
	githubDownload("config/modules.js", "config/modules.js");
}


function makeModulesJsonFile(){
	let modulesJsonFileData = `[]`;
	makeFolder("config");
	makeFile("config/modules.json", modulesJsonFileData);
}

function makeMongooseJsFile() {
	makeFolder("config");
	githubDownload("config/mongoose.js", "config/mongoose.js");
}

function makeSwaggerJsFile() {
	makeFolder("config");
	githubDownload("config/swagger.js", "config/swagger.js");
}

function makeEnvFiles(){
	let envData = `{
	"db": {
		"url": "mongodb://localhost/catsdb"
	},
	"app" : {
		"port": 3000
	}
}`;
	makeFolder("config");
	makeFolder("config/env");
	makeFile("config/env/development.json", envData);
	makeFile("config/env/production.json", envData);
	makeFile("config/env/default.json", envData);
}


function makeEnvIndexJsFile(){
	makeFolder("config");
	makeFolder("config/env");
	githubDownload("config/env/index.js", "config/env/index.js");
}