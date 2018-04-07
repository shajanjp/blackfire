const helperUtilities = require('./lib.generator.js');

module.exports = function(filePath, moduleDetails) {
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
};
