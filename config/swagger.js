let swaggerJSDoc = require('swagger-jsdoc');
const config = require('../config/env/');

const options = {
  swaggerDefinition: {
    info: {
      title: 'Blackfire Docs',
      version: '1.0.0',
      description: '',
    },
    host: `${config.app.host}:${config.app.port}`,
  },
  apis: ['**/*.docs.yaml'],
};

module.exports = swaggerJSDoc(options);
