#!/usr/bin/env node
const fs = require('fs');

const modulesDir = 'app';
const modulesListPath = 'config/modules.json';
const { https } = require('follow-redirects');

const githubRoot = 'https://github.com/shajanjp/blackfire/raw/master/';
const moduleDetails = {};
let appFolder;

const helperUtilities = require("./utilities/lib.generator.js");
const moduleUtilities = require("./utilities/module.generator.js");

function generateControllerFile(filePath) {
  const controllerData = `const ${moduleDetails.singularCamel} = require('mongoose').model('${moduleDetails.singular}');
const ${moduleDetails.singular}Validation = require('../libraries/${moduleDetails.plural}.server.validation.js');

exports.${moduleDetails.singular}byId = (req, res, next, ${moduleDetails.singular}_id) => {
  ${moduleDetails.singularCamel}.findOne({ _id: ${moduleDetails.singular}_id })
  .then(${moduleDetails.singular}Found => {
    res.locals.${moduleDetails.singular}_id = ${moduleDetails.singular}Found._id;
    next();
  })
  .catch(err => {
    return res.status(404).json({ 
      "message": '${moduleDetails.singularCamel} not found!',
      "errors": err
    });
  });
}

exports.insert${moduleDetails.singularCamel} = (req, res) => {
  let new${moduleDetails.singularCamel} = new ${moduleDetails.singularCamel}(res.locals.${moduleDetails.singular});
  new${moduleDetails.singularCamel}.save()
  .then(${moduleDetails.singular}Saved => {
    return res.status(201).json(${moduleDetails.singular}Saved);
  })
  .catch(err => {
    return res.status(500).json({
      "message": "Internal error",
      "errors": err
    });
  });
}

exports.get${moduleDetails.pluralCamel} = (req, res) => {
  ${moduleDetails.singularCamel}.find({})
  .then(${moduleDetails.singular}List => {
    return res.status(200).json(${moduleDetails.singular}List);
  })
  .catch(err => {
    return res.status(500).json({
      "message": "Internal error",
      "errors": err
    });
  });
}

exports.update${moduleDetails.singularCamel} = (req, res) => {
  ${moduleDetails.singularCamel}.update({ _id: res.locals.${moduleDetails.singular}_id }, res.locals.${moduleDetails.singular}, { safe: true })
  .then(${moduleDetails.singular}Updated => {
    return res.status(200).json({});
  })
  .catch(err => {
    return res.status(500).json({
      "message": "Internal error",
      "errors": err
    });
  });
}

exports.get${moduleDetails.singularCamel} = (req, res) => {
  ${moduleDetails.singularCamel}.findOne({ _id: res.locals.${moduleDetails.singular}_id }).exec()
  .then(${moduleDetails.singular}Found => {
    return res.status(200).json(${moduleDetails.singular}Found);
  })
  .catch(err => {
    return res.status(500).json({
      "message": "Internal error",
      "errors": err
    });
  });
}

exports.remove${moduleDetails.singularCamel} = (req, res) => {
  ${moduleDetails.singularCamel}.remove({ _id: res.locals.${moduleDetails.singular}_id })
  .then(${moduleDetails.singular}Removed => {
    return res.status(200).json({});
  })
  .catch(err => {
    return res.satus(500).json({
      "message": "Internal error",
      "errors": err
    });
  });
}`;
  helperUtilities.makeFile(filePath, controllerData);
}

function generateRouterFile(filePath) {
  const routerData = `const express = require('express');
const router = express.Router();
const ${moduleDetails.singular}Controller = require('../controllers/${moduleDetails.plural}.server.controller.js');
const ${moduleDetails.singular}Validator = require('../libraries/${moduleDetails.plural}.server.validation.js');

router.route('/')
.post(${moduleDetails.singular}Validator.validateInsert${moduleDetails.singularCamel}, ${moduleDetails.singular}Controller.insert${moduleDetails.singularCamel})
.get(${moduleDetails.singular}Controller.get${moduleDetails.pluralCamel});

router.route('/:${moduleDetails.singular}_id')
.put(${moduleDetails.singular}Validator.validateInsert${moduleDetails.singularCamel}, ${moduleDetails.singular}Controller.update${moduleDetails.singularCamel})
.get(${moduleDetails.singular}Controller.get${moduleDetails.singularCamel})
.delete(${moduleDetails.singular}Controller.remove${moduleDetails.singularCamel})

router.param('${moduleDetails.singular}_id', ${moduleDetails.singular}Controller.${moduleDetails.singular}byId)

module.exports = router;`;
  helperUtilities.makeFile(filePath, routerData);
}

function generateValidaionFile(filePath) {
  const validationFileData = `const joi = require('joi');
const mongoId = joi.string().length(24);

const ${moduleDetails.singular}InsertSchema = joi.object().keys({
  title: joi.string().max(8).required()
});

exports.validateInsert${moduleDetails.singularCamel} = function (req, res, next) {
  joi.validate(req.body, ${moduleDetails.singular}InsertSchema, { 'stripUnknown': true }, function (err, validated) {
    if(err)
      return res.status(500).json({ 
        "errors": err.details[0].message
      });
    else {
      res.locals.${moduleDetails.singular} = validated;
      return next();
    }
  });
}`;
  helperUtilities.makeFile(filePath, validationFileData);
}

function addModuleToList() {
  const moduleDataItem = {
    name: moduleDetails.plural,
    title: moduleDetails.pluralCamel,
    root: `/${moduleDetails.plural}`,
  };

  fs.readFile(modulesListPath, 'utf8', (err, content) => {
    if (err) throw err;
    const modulesList = JSON.parse(content);
    modulesList.push(moduleDataItem);
    helperUtilities.makeFile(modulesListPath, JSON.stringify(modulesList, null, 2));
    console.log('Module added to modulesListPath');
  });
}

function makeModuleFilesAndFolders() {
  const moduleRoot = `${modulesDir}/${moduleDetails.plural}`;
  helperUtilities.makeFolder(`${moduleRoot}`);
  helperUtilities.makeFolder(`${moduleRoot}/config`);
  helperUtilities.makeFolder(`${moduleRoot}/controllers`);
  helperUtilities.makeFolder(`${moduleRoot}/libraries`);
  helperUtilities.makeFolder(`${moduleRoot}/models`);
  helperUtilities.makeFolder(`${moduleRoot}/routes`);
  helperUtilities.makeFolder(`${moduleRoot}/docs`);

  moduleUtilities.generateConfigFile(`${moduleRoot}/config/${moduleDetails.plural}.config.json`);
  generateModelFile(`${moduleRoot}/models/${moduleDetails.plural}.server.model.js`);
  generateControllerFile(`${moduleRoot}/controllers/${moduleDetails.plural}.server.controller.js`);
  generateValidaionFile(`${moduleRoot}/libraries/${moduleDetails.plural}.server.validation.js`);
  moduleUtilities.generateSwaggerDocs(`${moduleRoot}/docs/${moduleDetails.plural}.docs.yaml`);
  helperUtilities.makeFile(`${moduleRoot}/libraries/${moduleDetails.plural}.server.library.js`, '');
  generateRouterFile(`${moduleRoot}/routes/${moduleDetails.plural}.server.route.js`);
  addModuleToList();
}

function makePackageJsonFile() {
  helperUtilities.githubDownload(`${appFolder}/package.json`, 'blackfire-package.json');
}

function makeGitIgnoreFile() {
  helperUtilities.githubDownload(`${appFolder}/.gitignore`, '.gitignore');
}

function makeServerJsFile() {
  helperUtilities.githubDownload(`${appFolder}/server.js`, 'server.js');
}

function makeExpressJsFile() {
  helperUtilities.makeFolder(`${appFolder}/config`);
  helperUtilities.githubDownload(`${appFolder}/config/express.js`, 'config/express.js');
}

function makeModulesJsFile() {
  helperUtilities.makeFolder(`${appFolder}/config`);
  helperUtilities.githubDownload(`${appFolder}/config/modules.js`, 'config/modules.js');
}

function makeModulesJsonFile() {
  const modulesJsonFileData = '[]';
  helperUtilities.makeFolder(`${appFolder}/config`);
  helperUtilities.makeFile(`${appFolder}/config/modules.json`, modulesJsonFileData);
}

function makeMongooseJsFile() {
  helperUtilities.makeFolder(`${appFolder}/config`);
  helperUtilities.githubDownload(`${appFolder}/config/mongoose.js`, 'config/mongoose.js');
}

function makeSwaggerJsFile() {
  helperUtilities.makeFolder(`${appFolder}/config`);
  helperUtilities.githubDownload(`${appFolder}/config/swagger.js`, 'config/swagger.js');
}

function makeEnvFiles() {
  const envData = `{
  "db": {
    "url": "mongodb://localhost/blackfiredb"
  },
  "app" : {
    "port": 3000,
    "host": "localhost"
  }
}`;
  helperUtilities.makeFolder(`${appFolder}/config`);
  helperUtilities.makeFolder(`${appFolder}/config/env`);
  helperUtilities.makeFile(`${appFolder}/config/env/development.json`, envData);
  helperUtilities.makeFile(`${appFolder}/config/env/production.json`, envData);
  helperUtilities.makeFile(`${appFolder}/config/env/default.json`, envData);
}


function makeEnvIndexJsFile() {
  helperUtilities.makeFolder(`${appFolder}/config`);
  helperUtilities.makeFolder(`${appFolder}/config/env`);
  helperUtilities.githubDownload(`${appFolder}/config/env/index.js`, 'config/env/index.js');
}

if (process.argv.length == 4 && process.argv[2] == 'new') {
  appFolder = process.argv[3];
  helperUtilities.makeFolder(appFolder);
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
  helperUtilities.makeFolder(`${appFolder}/app`);
}

else if (process.argv.length == 5 && process.argv[2] == 'module') {
  moduleDetails.singular = process.argv[3];
  moduleDetails.plural = process.argv[4];
  moduleDetails.singularCamel = moduleDetails.singular.charAt(0).toUpperCase() + moduleDetails.singular.slice(1);
  moduleDetails.pluralCamel = moduleDetails.plural.charAt(0).toUpperCase() + moduleDetails.plural.slice(1);

  makeModuleFilesAndFolders();
} 

else if (process.argv.length == 3 && (process.argv[2] == 'help' || process.argv[2] == '--help' || process.argv[2] == 'h' || process.argv[2] == '-h')) {
  console.log(`
Usage: blackfire <command>

where <command> is one of:
    new, module, remove, status, report

blackfire help <term>  search for help on <term>
blackfire <cmd> -h     quick help on <cmd>
blackfire new foo     creates an application foo
blackfire module <singular> <plural>     adds module cats
  eg : blackfire module cat cats
  
Config info can be viewed via: blackfire help config

blackfire@0.0.24
`);
}

else {
  console.log('Error in usage.');
  console.log('Usage: blackfire "cars" "car" "cars"');
}