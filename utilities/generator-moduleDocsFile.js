const helperUtilities = require("./lib.generator.js");

module.exports = function(filePath, moduleDetails) {
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
      name: Body
      required: true
      schema:
        type: object
        properties:
          title:
            type: string
            example: EXAMPLE
            required: true
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
  helperUtilities.makeFile(filePath, swaggerFileData);
}