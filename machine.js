#!/usr/bin/env node
const fs = require('fs');
const modulesDir = 'app';
const modulesListPath = 'config/modules.json';

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

function addModuleToList(moduleName, moduleAPIRoot) {
	let moduleTitle = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
	moduleName = moduleName.toLowerCase();

	let moduleDataItem = {
		"name": moduleName,
		"title": moduleTitle,
		"root": `/${moduleAPIRoot}`
	};

	fs.readFile(modulesListPath, 'utf8', (err, content) => {
		if (err) throw err;
		let modulesList = JSON.parse(content);
		modulesList.push(moduleDataItem);
		makeFile(modulesListPath, JSON.stringify(modulesList, null, 2));
		console.log(`Module added to modulesListPath`);
	});
}

function makeModuleFilesAndFolders(moduleName, moduleSingular, moduleAPIRoot) {
	let moduleRoot = `${modulesDir}/${moduleName}`;
	makeFolder(`${moduleRoot}`);
	makeFolder(`${moduleRoot}/config`);
	makeFolder(`${moduleRoot}/controllers`);
	makeFolder(`${moduleRoot}/libraries`);
	makeFolder(`${moduleRoot}/models`);
	makeFolder(`${moduleRoot}/routes`);

	generateConfigFile(`${moduleRoot}/config/${moduleName}.config.json`, moduleName, moduleSingular); 
	generateControllerFile(`${moduleRoot}/controllers/${moduleName}.server.controller.js`);
	makeFile(`${moduleRoot}/libraries/${moduleName}.server.library.js`, ""); 
	makeFile(`${moduleRoot}/models/${moduleName}.server.model.js`, ""); 
	generateRouterFile(`${moduleRoot}/routes/${moduleName}.server.route.js`, moduleName, moduleSingular); 
	addModuleToList(moduleName, moduleAPIRoot)
}

function makePackageJsonFile(appName){
let packageData = `{
  "name": "catlife",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "body-parser": "^1.7.2",
    "compression": "^1.7.0",
    "cookie-parser": "^1.4.3",
    "express": "^4.15.4",
    "mongoose": "^4.11.6"
  },
  "devDependencies": {
    "morgan": "^1.8.1",
    "nodemon": "^1.17.2"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
`;
	makeFile("package.json", packageData);
}

function makeGitIgnoreFile(){
	gitIgnoreData = `node_modules/
npm-debug.log
yarn.lock`;
	makeFile('.gitignore', gitIgnoreData);
}

function makeServerJsFile(){
	let serverJsData = `let config = require('./config/env');
var mongoose = require('./config/mongoose')
var express = require('./config/express');
var db = mongoose();
var	app = express();

app.listen(3000, function() {
	console.log(\`Server started at http://localhost:\${config.app.port} using \${process.env.NODE_ENV || "default"} config file\`);
});`;
	makeFile("server.js", serverJsData);
}


function makeExpressJsFile(){
	let expressJsData = `let config = require('./env');
var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var activeModules = require('./modules.js').activeModules;
var mainRoutes = express.Router();

module.exports = function(){
	var app = express();

	if(process.env.NODE_ENV === 'development'){
		app.use(morgan('dev'));
	} else if(process.env.NODE_ENV === 'production'){
		app.use(compress());
	}

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(cookieParser());

	console.log('loading routes...');
	activeModules.forEach(function(module) {
		moduleRoutes = require('../app/' + module.name + '/config/' + module.name + '.config.json').routes;
		if(moduleRoutes != undefined){
			moduleRoutes.forEach(function(routeFile){
				mainRoutes.use(module.root, require('../app/'+ module.name + '/routes/' + routeFile));
				console.log("loading " + routeFile);
			});
		}
	});
	
	app.use('/api', mainRoutes);

	return app;
}`;
	makeFolder("config");
	makeFile("config/express.js", expressJsData);
}


function makeModulesJsFile(){
	let modulesJsonFileData = `var fs = require('fs');
var activeModules = JSON.parse(fs.readFileSync('config/modules.json', 'utf8'));
exports.activeModules = activeModules;`;
	makeFolder("config");
	makeFile("config/modules.json", modulesJsonFileData);
}


function makeModulesJsonFile(){
	let modulesJsData = `[
	{
		"name": "cats",
		"title": "Cats",
		"root": "/cats"
	}
]`;
	makeFolder("config");
	makeFile("config/modules.json", modulesJsData);
}

function makeMongooseJsFile() {
	let mongooseJsData = `let config = require('./env/');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

var activeModules = require('./modules.js').activeModules;
var moduleModels;

module.exports = function() {
	var db = mongoose.connect(config.db.url, {
		useMongoClient: true
	});

	console.log(\`using mongodb at \${config.db.url}\`);
	console.log(\`registering mongoose schemas...\`);
	activeModules.forEach(function(module) {
		moduleModels = require('../app/' + module.name + '/config/' + module.name + '.config.json').models;
		if(moduleModels != undefined && moduleModels.length > 0){
			moduleModels.forEach(function(modelFile){
				require('../app/'+ module.name + '/models/' + modelFile);
				console.log("registering " + modelFile);
			});
		}
	});
	return db;
};`;
	makeFolder("config");
	makeFile("config/mongoose.js", mongooseJsData);
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
	makeFile("config/env/default", envData);
}


function makeEnvIndexJsFile(){
	let envIndexJsFileData = `const ENV_USING = process.env.NODE_ENV || "default";
if(typeof require(\`./\${ENV_USING}.json\`) !== "object") {
	console.log(\`Couldnt find configuration file "\${ENV_USING}.json" in env folder.\`);
	console.log(\`Set NODE_ENV properly and restart.\`);
	process.exit();
}
console.log(\`Using configuration from \${ENV_USING}.json\`);

module.exports = require(`./\${ENV_USING}.json`);`;

	makeFolder("config");
	makeFolder("config/env");
	makeFile("config/env/index.js", envIndexJsFileData);
}

 
if(process.argv[2] == "init"){
	makeServerJsFile();
	makePackageJsonFile();
	makeGitIgnoreFile();
	makeExpressJsFile();
	makeMongooseJsFile();
	makeModulesJsonFile();
	makeModulesJsFile();
	makeEnvFiles();
	return console.log("Success");
}

if(process.argv.length == 5){
	let userInput = {};
	userInput.moduleName = process.argv[2];
	userInput.moduleSingular = process.argv[3];
	userInput.moduleAPIRoot = process.argv[4];
	makeModuleFilesAndFolders(userInput.moduleName, userInput.moduleSingular, userInput.moduleAPIRoot);
} else {
	console.log('Error in usage.');
	console.log('Usage: blackfire "cars" "car" "cars"');
}