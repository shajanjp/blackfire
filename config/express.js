const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const activeModules = require('./modules.js').activeModules;

const mainRoutes = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.js');

module.exports = function () {
  const app = express();

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));

  app.use(cookieParser());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  console.log('loading routes...');
  activeModules.forEach((module) => {
    const moduleRoutes = require(`../app/${module.name}/config/${module.name}.config.json`).routes;
    if (moduleRoutes !== undefined) {
      moduleRoutes.forEach((routeFile) => {
        mainRoutes.use(module.root, require(`../app/${module.name}/routes/${routeFile}`));
        console.log(`loading ${routeFile}`);
      });
    }
  });

  app.use('/api', mainRoutes);

  return app;
};
