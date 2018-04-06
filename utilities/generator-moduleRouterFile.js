const helperUtilities = require("./lib.generator.js");

module.exports = function(filePath, moduleDetails) {
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