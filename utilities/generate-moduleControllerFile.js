const helperUtilities = require('./lib.generator.js');

module.exports = function(filePath, moduleDetails) {
  const controllerData = `const ${moduleDetails.singularCamel} = require('mongoose').model('${moduleDetails.singular}');
const ${moduleDetails.singular}Validation = require('../libraries/${moduleDetails.plural}.server.validation.js');

exports.${moduleDetails.singular}byId = (req, res, next, ${moduleDetails.singular}Id) => {
  ${moduleDetails.singularCamel}.findOne({ _id: ${moduleDetails.singular}Id })
  .then(${moduleDetails.singular}Found => {
    res.locals.${moduleDetails.singular}Id = ${moduleDetails.singular}Found._id;
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
  ${moduleDetails.singularCamel}.update({ _id: res.locals.${moduleDetails.singular}Id }, res.locals.${moduleDetails.singular}, { safe: true })
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
  ${moduleDetails.singularCamel}.findOne({ _id: res.locals.${moduleDetails.singular}Id }).exec()
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
  ${moduleDetails.singularCamel}.remove({ _id: res.locals.${moduleDetails.singular}Id })
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
};
