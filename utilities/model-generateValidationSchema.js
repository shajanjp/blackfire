function parseType(freeType) {
  switch (freeType) {
    case 'string':
    case 'String':
    case 'char':
    case 'varchar':
    case 'character':
      return 'joi.string().allow(\'\').optional()';
      break;

    case 'ObjectId':
    case 'objectId':
    case 'objectid':
    case 'mongoid':
    case 'mongoId':
      return 'mongoId.optional()';
      break;

    case 'number':
    case 'Number':
    case 'integer':
    case 'Integer':
    case 'int':
      return 'joi.number().optional()';
      break;
  }
}

function makeKeyType(schemaDataP, key) {
  // passes string, number, date
  if (schemaDataP[key].constructor === String) {
    return `\n  ${key}: ${parseType(schemaDataP[key])},`;
  }

  // passes [String], [Number], [Date]
  if (schemaDataP[key].constructor === Array && schemaDataP[key][0].constructor === String) {
    return `\n  ${key}: joi.array().items(${parseType(schemaDataP[key][0])}).optional().default([]),`;
  }

  // passes {}
  if (schemaDataP[key].constructor === Object) {
    let tempObject = `\n  ${key}: joi.object().keys({`;
    Object.keys(schemaDataP[key]).forEach((keyIn) => {
      tempObject += makeKeyType(schemaDataP[key], keyIn);
    });
    tempObject += '\n  }),';
    return tempObject;
  }

  // passes [{}]
  if (schemaDataP[key].constructor === Array && schemaDataP[key][0].constructor === Object) {
    let tempObject = `\n  ${key}: joi.array().items(joi.object().keys({`;
    Object.keys(schemaDataP[key][0]).forEach((keyIn) => {
      tempObject += makeKeyType(schemaDataP[key][0], keyIn);
    });
    tempObject += '\n})).optional().default([]),';
    return tempObject;
  }
}

function makeValidation(schemaJson) {
  // let renderedSchema = '{';
  let renderedSchema = '';
  let schemaKeys = Object.keys(schemaJson);

  schemaKeys.forEach((key) => {
    renderedSchema += makeKeyType(schemaJson, key);
  });
  return renderedSchema;
};


module.exports = makeValidation;
