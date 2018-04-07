const fs = require('fs');
const helperUtilities = require('./lib.generator.js');
const modulesListPath = 'config/modules.json';

function addModuleToList(moduleDetails) {
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

function makePackageJsonFile(appFolder) {
  helperUtilities.githubDownload(`${appFolder}/package.json`, 'blackfire-package.json');
}

function makeGitIgnoreFile(appFolder) {
  helperUtilities.githubDownload(`${appFolder}/.gitignore`, '.gitignore');
}

function makeServerJsFile(appFolder) {
  helperUtilities.githubDownload(`${appFolder}/server.js`, 'server.js');
}

function makeExpressJsFile(appFolder) {
  helperUtilities.makeFolder(`${appFolder}/config`);
  helperUtilities.githubDownload(`${appFolder}/config/express.js`, 'config/express.js');
}

function makeModulesJsFile(appFolder) {
  helperUtilities.makeFolder(`${appFolder}/config`);
  helperUtilities.githubDownload(`${appFolder}/config/modules.js`, 'config/modules.js');
}

function makeModulesJsonFile(appFolder) {
  const modulesJsonFileData = '[]';
  helperUtilities.makeFolder(`${appFolder}/config`);
  helperUtilities.makeFile(`${appFolder}/config/modules.json`, modulesJsonFileData);
}

function makeMongooseJsFile(appFolder) {
  helperUtilities.makeFolder(`${appFolder}/config`);
  helperUtilities.githubDownload(`${appFolder}/config/mongoose.js`, 'config/mongoose.js');
}

function makeSwaggerJsFile(appFolder) {
  helperUtilities.makeFolder(`${appFolder}/config`);
  helperUtilities.githubDownload(`${appFolder}/config/swagger.js`, 'config/swagger.js');
}

function makeEnvFiles(appFolder) {
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

function makeEnvIndexJsFile(appFolder) {
  helperUtilities.makeFolder(`${appFolder}/config`);
  helperUtilities.makeFolder(`${appFolder}/config/env`);
  helperUtilities.githubDownload(`${appFolder}/config/env/index.js`, 'config/env/index.js');
}

module.exports = {
  addModuleToList,
  makePackageJsonFile,
  makeGitIgnoreFile,
  makeServerJsFile,
  makeExpressJsFile,
  makeModulesJsFile,
  makeModulesJsonFile,
  makeMongooseJsFile,
  makeSwaggerJsFile,
  makeEnvFiles,
  makeEnvIndexJsFile,
};
