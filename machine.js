#!/usr/bin/env node
const fs = require('fs');
const modulesDir = 'app';
const moduleDetails = {};
moduleDetails.modelData = {
  "title": "String"
};

const framework = require('./utilities/framework.library.js');
const factory = require('./utilities/factory.js');
const helperUtilities = require('./utilities/lib.generator.js');


function makeModuleFilesAndFolders(moduleDetails) {
  const moduleRoot = `${modulesDir}/${moduleDetails.plural}`;
  helperUtilities.makeFolder(`${moduleRoot}`);
  helperUtilities.makeFolder(`${moduleRoot}/config`);
  helperUtilities.makeFolder(`${moduleRoot}/controllers`);
  helperUtilities.makeFolder(`${moduleRoot}/libraries`);
  helperUtilities.makeFolder(`${moduleRoot}/models`);
  helperUtilities.makeFolder(`${moduleRoot}/routes`);
  helperUtilities.makeFolder(`${moduleRoot}/docs`);

  factory.generateConfigFile(`${moduleRoot}/config/${moduleDetails.plural}.config.json`, moduleDetails);
  factory.generateModelFile(`${moduleRoot}/models/${moduleDetails.plural}.server.model.js`, moduleDetails);
  factory.generateControllerFile(`${moduleRoot}/controllers/${moduleDetails.plural}.server.controller.js`, moduleDetails);
  factory.generateValidaionFile(`${moduleRoot}/libraries/${moduleDetails.plural}.server.validation.js`, moduleDetails);
  factory.generateSwaggerDocs(`${moduleRoot}/docs/${moduleDetails.plural}.docs.yaml`, moduleDetails);
  helperUtilities.makeFile(`${moduleRoot}/libraries/${moduleDetails.plural}.server.library.js`, '');
  factory.generateRouterFile(`${moduleRoot}/routes/${moduleDetails.plural}.server.api.route.js`, moduleDetails);
  factory.generateRouterFile(`${moduleRoot}/routes/${moduleDetails.plural}.server.ui.route.js`, moduleDetails);
  framework.addModuleToList(moduleDetails);
}

// > blackfire init
if (process.argv.length == 3 && process.argv[2] == 'init') {
  appFolder = '.';
  framework.makeServerJsFile(appFolder);
  framework.makePackageJsonFile(appFolder);
  framework.makeGitIgnoreFile(appFolder);
  framework.makeExpressJsFile(appFolder);
  framework.makeMongooseJsFile(appFolder);
  framework.makeSwaggerJsFile(appFolder);
  framework.makeModulesJsonFile(appFolder);
  framework.makeModulesJsFile(appFolder);
  framework.makeEnvFiles(appFolder);
  framework.makeEnvIndexJsFile(appFolder);
  helperUtilities.makeFolder(`${appFolder}/app`);
} 

// > blackfire new
else if (process.argv.length == 4 && process.argv[2] == 'new') {
  appFolder = process.argv[3];
  helperUtilities.makeFolder(appFolder);
  framework.makeServerJsFile(appFolder);
  framework.makePackageJsonFile(appFolder);
  framework.makeGitIgnoreFile(appFolder);
  framework.makeExpressJsFile(appFolder);
  framework.makeMongooseJsFile(appFolder);
  framework.makeSwaggerJsFile(appFolder);
  framework.makeModulesJsonFile(appFolder);
  framework.makeModulesJsFile(appFolder);
  framework.makeEnvFiles(appFolder);
  framework.makeEnvIndexJsFile(appFolder);
  helperUtilities.makeFolder(`${appFolder}/app`);
} 
  // blackfire module generation
else if (process.argv.length >= 5 && process.argv[2] == 'module') {
  moduleDetails.singular = process.argv[3];
  moduleDetails.plural = process.argv[4];
  moduleDetails.singularCamel = moduleDetails.singular.charAt(0).toUpperCase() + moduleDetails.singular.slice(1);
  moduleDetails.pluralCamel = moduleDetails.plural.charAt(0).toUpperCase() + moduleDetails.plural.slice(1);
  
  // > blackfire module cat cats --model cats-schema.json 
  if(process.argv[5] == "--model" && process.argv[6]){
    fs.readFile(process.argv[6], 'utf8', (err, content) => {
      moduleDetails.modelData = JSON.parse(content);

      makeModuleFilesAndFolders(moduleDetails);
    });
  }
  
  // > blackfire module cat cats
  else {
      moduleDetails.modelData = { "title": "string" };    
      makeModuleFilesAndFolders(moduleDetails);
  }
} 

  // > blackfire help
else if (process.argv.length == 3 && (process.argv[2] == 'help' || process.argv[2] == '--help' || process.argv[2] == 'h' || process.argv[2] == '-h')) {
  console.log(`
Usage: blackfire <command>

where <command> is one of:
    new, module, remove, status, report

blackfire help <term>  :  search for help on <term>
blackfire <cmd> -h  :  quick help on <cmd>
blackfire new <app name>  :  creates an application foo
  eg : blackfire new myApp
blackfire module <singular> <plural>  :  adds module cats
  eg : blackfire module cat cats
Config info can be viewed via: blackfire help config

blackfire@0.0.24
`);
} else {
  console.log('Error in usage.');
  console.log('Usage: blackfire new <app name>');
  console.log('Usage: blackfire module <module singular> <module plural>');
}
