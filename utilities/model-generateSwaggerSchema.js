function parseType(freeType) {
  switch (freeType) {
    case 'string':
    case 'String':
    case 'char':
    case 'varchar':
    case 'character':
      return `\n            type: string
            example: EXAMPLE`;
      break;

    case 'ObjectId':
    case 'objectId':
    case 'objectid':
    case 'mongoid':
    case 'mongoId':
      return `\n            type: string
            example: 5ac7508ec5c8fa23b180c08b`;
      break;

    case 'number':
    case 'Number':
    case 'integer':
    case 'Integer':
    case 'int':
      return `\n            type: number
            example: 123`;
      break;
  }
}

function makeKeyType(schemaDataP, key) {
  // passes string, number, date
  if (schemaDataP[key].constructor === String) {
    return `          ${key}: ${parseType(schemaDataP[key])}\n`;
  }

  // passes [String], [Number], [Date]
  if (schemaDataP[key].constructor === Array && schemaDataP[key][0].constructor === String) {
    return `          ${key}[0]: ${parseType(schemaDataP[key][0])}\n`;
  }

  // passes {}
  if (schemaDataP[key].constructor === Object) {
    let tempObject = ``;
    Object.keys(schemaDataP[key]).forEach((keyIn) => {
      tempObject += makeKeyType(schemaDataP[key], keyIn);
    });
    tempObject += '';
    return tempObject;
  }

  // passes [{}]
  if (schemaDataP[key].constructor === Array && schemaDataP[key][0].constructor === Object) {
    let tempObject = ``;
    Object.keys(schemaDataP[key][0]).forEach((keyIn) => {
      tempObject += makeKeyType(schemaDataP[key][0], keyIn);
    });
    tempObject += '';
    return tempObject;
  }
}

function generateSwaggerSchema(schemaJson) {
  let renderedSchema = '';
  let schemaKeys = Object.keys(schemaJson);

  schemaKeys.forEach((key) => {
    renderedSchema += makeKeyType(schemaJson, key);
  });

  return renderedSchema;
};

module.exports = generateSwaggerSchema;
