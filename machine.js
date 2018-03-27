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

function generateConfigFile(filePath) {
	let configData = `{
	"name" : "${moduleDetails.plural}",
	"title" : "${moduleDetails.pluralCamel}",
	"description" : "${moduleDetails.pluralCamel} will be ${moduleDetails.plural} !",
	"routes": ["${moduleDetails.plural}.server.route.js"],
	"models": ["${moduleDetails.plural}.server.model.js"],
	"root": "/${moduleDetails.plural}"
}`;
	makeFile(filePath, configData);
}

function generateModelFile(filePath) {
	let modelFileData = `const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ${moduleDetails.singular}Schema = new Schema({
});

mongoose.model('${moduleDetails.singular}', ${moduleDetails.singular}Schema);`
makeFile(filePath, modelFileData);
}

function generateControllerFile(filePath) {
	let controllerData = `var ${moduleDetails.singularCamel} = require('mongoose').model('${moduleDetails.singular}')
let ${moduleDetails.singular}Validation = require('../libraries/${moduleDetails.plural}.server.validation.js');

exports.${moduleDetails.singular}byId = (req, res, next, ${moduleDetails.singular}_id) => {
	next();
}

exports.create${moduleDetails.singularCamel} = (req, res) => {
	res.json({ "success": true });
}

exports.list${moduleDetails.pluralCamel} = (req, res) => {
	res.json({ "success": true });
}

exports.update${moduleDetails.singularCamel} = (req, res) => {
	res.json({ "success": true });
}

exports.get${moduleDetails.singularCamel} = (req, res) => {
	res.json({ "success": true });
}

exports.remove${moduleDetails.singularCamel} = (req, res) => {
	res.json({ "success": true });
}`;
	makeFile(filePath, controllerData);
}

function generateRouterFile(filePath) {
	let routerData = `const express = require('express');
const router = express.Router();
const ${moduleDetails.singular}Controller = require('../controllers/${moduleDetails.plural}.server.controller.js');

router.route('/')
.post(${moduleDetails.singular}Controller.create${moduleDetails.singularCamel})
.get(${moduleDetails.singular}Controller.list${moduleDetails.pluralCamel});

router.route('/:${moduleDetails.singular}_id')
.put(${moduleDetails.singular}Controller.update${moduleDetails.singularCamel})
.get(${moduleDetails.singular}Controller.get${moduleDetails.singularCamel})
.delete(${moduleDetails.singular}Controller.remove${moduleDetails.singularCamel})

router.param('${moduleDetails.singular}_id', ${moduleDetails.singular}Controller.${moduleDetails.singular}byId)

module.exports = router;`;
	makeFile(filePath, routerData);
}

function addModuleToList() {
	let moduleDataItem = {
		"name": moduleDetails.plural,
		"title": moduleDetails.pluralCamel,
		"root": `/${moduleDetails.plural}`
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
	let moduleRoot = `${modulesDir}/${moduleDetails.plural}`;
	makeFolder(`${moduleRoot}`);
	makeFolder(`${moduleRoot}/config`);
	makeFolder(`${moduleRoot}/controllers`);
	makeFolder(`${moduleRoot}/libraries`);
	makeFolder(`${moduleRoot}/models`);
	makeFolder(`${moduleRoot}/routes`);
	makeFolder(`${moduleRoot}/docs`);

	generateConfigFile(`${moduleRoot}/config/${moduleDetails.plural}.config.json`); 
	generateControllerFile(`${moduleRoot}/controllers/${moduleDetails.plural}.server.controller.js`);
	makeFile(`${moduleRoot}/libraries/${moduleDetails.plural}.server.library.js`, ""); 
	makeFile(`${moduleRoot}/models/${moduleDetails.plural}.server.model.js`, ""); 
	generateRouterFile(`${moduleRoot}/routes/${moduleDetails.plural}.server.route.js`); 
	addModuleToList();
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