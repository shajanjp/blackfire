const fs = require('fs');
const modulesDir = 'app' 
const modulesListPath = 'config/modules_list.json';

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