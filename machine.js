#!/usr/bin/env node
const fs = require('fs');

const modulesDir = 'app';
const modulesListPath = 'config/modules.json';
const { https } = require('follow-redirects');

const githubRoot = 'https://github.com/shajanjp/blackfire/raw/master/';
const moduleDetails = {};
let appFolder;

if (process.argv.length == 3 && (process.argv[2] == 'help' || process.argv[2] == '--help' || process.argv[2] == 'h' || process.argv[2] == '-h')) {
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

function generateSwaggerDocs(filePath){
  let swaggerFileData = `securityDefinitions:
  Bearer:
    type: apiKey
    name: Authorization
    in: header
tags:
- name: "${moduleDetails.pluralCamel}"
  description: "${moduleDetails.pluralCamel} APIs" 
/api/${moduleDetails.plural}:
  post:
    summary: Create ${moduleDetails.singular}
    description: Create a ${moduleDetails.singular} by data provided
    security:
    - Bearer: []
    tags:
    - ${moduleDetails.pluralCamel}
    responses:
      201:
        description: Success
    parameters:
    - in: body
      name: title
      description: Restaurent title
      example: EXAMPLE_RESTAURANT_TITLE
  get:
    summary: List ${moduleDetails.plural}
    description: List ${moduleDetails.plural}
    security:
    - Bearer: []
    tags:
    - ${moduleDetails.pluralCamel}
    responses:
      200:
        description: Success

/api/${moduleDetails.plural}/{${moduleDetails.singular}_id}:
  get:
    summary: Get ${moduleDetails.singular} details
    description: Get details of specified ${moduleDetails.singular}
    security:
    - Bearer: []
    tags:
    - ${moduleDetails.pluralCamel}
    responses:
      200:
        description: Success
    parameters:
    - in: path
      name: ${moduleDetails.singular}_id
      schema:
        type: string
      required: true
      description: ${moduleDetails.singularCamel} ID
  put:
    summary: Update ${moduleDetails.singular}
    description: Update ${moduleDetails.singular} with provided data
    security:
    - Bearer: []
    tags:
    - ${moduleDetails.pluralCamel}
    responses:
      200:
        description: Success
    parameters:
    - in: path
      name: ${moduleDetails.singular}_id
      schema:
        type: string
      required: true
      description: ${moduleDetails.singularCamel} ID
    - in: body
      name: Body
      required: true
      schema:
        type: object
        properties:
          title:
            type: string
            example: EXAMPLE_TITLE
            required: true
  delete:
    summary: Remove ${moduleDetails.singular}
    description: Remove specified ${moduleDetails.singular}
    security:
    - Bearer: []
    tags:
    - ${moduleDetails.pluralCamel}
    responses:
      200:
        description: Success
    parameters:
    - in: path
      name: ${moduleDetails.singular}_id
      schema:
        type: string
      required: true
      description: ${moduleDetails.singularCamel} ID
`;
makeFile(filePath, swaggerFileData);
}

if (process.argv.length == 4 && process.argv[2] == 'new') {
  appFolder = process.argv[3];
  makeFolder(appFolder);
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
  makeFolder(`${appFolder}/app`);
}

if (process.argv.length == 5 && process.argv[2] == 'module') {
  moduleDetails.singular = process.argv[3];
  moduleDetails.plural = process.argv[4];
  moduleDetails.singularCamel = moduleDetails.singular.charAt(0).toUpperCase() + moduleDetails.singular.slice(1);
  moduleDetails.pluralCamel = moduleDetails.plural.charAt(0).toUpperCase() + moduleDetails.plural.slice(1);

  makeModuleFilesAndFolders();
} else {
  console.log('Error in usage.');
  console.log('Usage: blackfire "cars" "car" "cars"');
}

function githubDownload(localFile, remoteFile) {
  https.get(`${githubRoot}${remoteFile}`, (response) => {
    response.on('data', (data) => {
      fs.writeFile(localFile, data, 'utf8', (err) => {
        if (!err) { console.log(`create ${localFile}`); } else { console.error(`couldn't download ${localFile}`); }
      });
    });
  })
    .on('error', () => {
      console.log(`couldn't download ${localFile}`);
    });
}

function makeFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log(`create ${folderPath}/`);
  }
}

function makeFile(filePath, content) {
  fs.writeFile(filePath, content, (err) => {
    if (err) throw err;
    console.log(`create ${filePath}`);
  });
}

function generateConfigFile(filePath) {
  const configData = `{
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
  const modelFileData = `const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ${moduleDetails.singular}Schema = new Schema({
  title: String
});

mongoose.model('${moduleDetails.singular}', ${moduleDetails.singular}Schema);`;
  makeFile(filePath, modelFileData);
}

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
  makeFile(filePath, controllerData);
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
  makeFile(filePath, routerData);
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
  makeFile(filePath, validationFileData);
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
    makeFile(modulesListPath, JSON.stringify(modulesList, null, 2));
    console.log('Module added to modulesListPath');
  });
}

function makeModuleFilesAndFolders() {
  const moduleRoot = `${modulesDir}/${moduleDetails.plural}`;
  makeFolder(`${moduleRoot}`);
  makeFolder(`${moduleRoot}/config`);
  makeFolder(`${moduleRoot}/controllers`);
  makeFolder(`${moduleRoot}/libraries`);
  makeFolder(`${moduleRoot}/models`);
  makeFolder(`${moduleRoot}/routes`);
  makeFolder(`${moduleRoot}/docs`);

  generateConfigFile(`${moduleRoot}/config/${moduleDetails.plural}.config.json`);
  generateModelFile(`${moduleRoot}/models/${moduleDetails.plural}.server.model.js`);
  generateControllerFile(`${moduleRoot}/controllers/${moduleDetails.plural}.server.controller.js`);
  generateValidaionFile(`${moduleRoot}/libraries/${moduleDetails.plural}.server.validation.js`);
  generateSwaggerDocs(`${moduleRoot}/docs/${moduleDetails.plural}.docs.yaml`);
  makeFile(`${moduleRoot}/libraries/${moduleDetails.plural}.server.library.js`, '');
  generateRouterFile(`${moduleRoot}/routes/${moduleDetails.plural}.server.route.js`);
  addModuleToList();
}

function makePackageJsonFile() {
  githubDownload(`${appFolder}/package.json`, 'blackfire-package.json');
}

function makeGitIgnoreFile() {
  githubDownload(`${appFolder}/.gitignore`, '.gitignore');
}

function makeServerJsFile() {
  githubDownload(`${appFolder}/server.js`, 'server.js');
}


function makeExpressJsFile() {
  makeFolder(`${appFolder}/config`);
  githubDownload(`${appFolder}/config/express.js`, 'config/express.js');
}


function makeModulesJsFile() {
  makeFolder(`${appFolder}/config`);
  githubDownload(`${appFolder}/config/modules.js`, 'config/modules.js');
}


function makeModulesJsonFile() {
  const modulesJsonFileData = '[]';
  makeFolder(`${appFolder}/config`);
  makeFile(`${appFolder}/config/modules.json`, modulesJsonFileData);
}

function makeMongooseJsFile() {
  makeFolder(`${appFolder}/config`);
  githubDownload(`${appFolder}/config/mongoose.js`, 'config/mongoose.js');
}

function makeSwaggerJsFile() {
  makeFolder(`${appFolder}/config`);
  githubDownload(`${appFolder}/config/swagger.js`, 'config/swagger.js');
}

function makeEnvFiles() {
  const envData = `{
  "db": {
    "url": "mongodb://localhost/catsdb"
  },
  "app" : {
    "port": 3000
  }
}`;
  makeFolder(`${appFolder}/config`);
  makeFolder(`${appFolder}/config/env`);
  makeFile(`${appFolder}/config/env/development.json`, envData);
  makeFile(`${appFolder}/config/env/production.json`, envData);
  makeFile(`${appFolder}/config/env/default.json`, envData);
}


function makeEnvIndexJsFile() {
  makeFolder(`${appFolder}/config`);
  makeFolder(`${appFolder}/config/env`);
  githubDownload(`${appFolder}/config/env/index.js`, 'config/env/index.js');
}
