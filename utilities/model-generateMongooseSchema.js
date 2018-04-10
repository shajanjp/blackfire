function parseType(freeType) {
  switch (freeType) {
    case 'string':
    case 'String':
    case 'char':
    case 'varchar':
    case 'character':
      return 'String';
      break;

    case 'ObjectId':
    case 'objectId':
    case 'objectid':
    case 'mongoid':
    case 'mongoId':
      return 'Schema.ObjectId';
      break;

    case 'number':
    case 'Number':
    case 'integer':
    case 'Integer':
    case 'int':
      return 'Number';
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
    return `\n  ${key}: [${parseType(schemaDataP[key][0])}],`;
  }

  // passes {}
  if (schemaDataP[key].constructor === Object) {
    let tempObject = `\n  ${key}: {`;
    Object.keys(schemaDataP[key]).forEach((keyIn) => {
      tempObject += makeKeyType(schemaDataP[key], keyIn);
    });
    tempObject += '\n  },';
    return tempObject;
  }

  // passes [{}]
  if (schemaDataP[key].constructor === Array && schemaDataP[key][0].constructor === Object) {
    let tempObject = `\n  ${key}: [{`;
    Object.keys(schemaDataP[key][0]).forEach((keyIn) => {
      tempObject += makeKeyType(schemaDataP[key][0], keyIn);
    });
    tempObject += '\n }],';
    return tempObject;
  }
}

module.exports = function(schemaJson) {
  let renderedSchema = '{';
  let schemaKeys = Object.keys(schemaJson);

  schemaKeys.forEach((key) => {
    renderedSchema += makeKeyType(schemaJson, key);
  });

  renderedSchema += '\n}';
  return renderedSchema;
};
