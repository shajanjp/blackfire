let swaggerJSDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      title: 'Blackfire Docs',
      version: '1.0.0',
      description: '',
    },
    host: 'guyswhocode.com',
    // basePath: '/api',
  },
  apis: ['**/*.docs.yaml'],
};

module.exports = swaggerJSDoc(options);