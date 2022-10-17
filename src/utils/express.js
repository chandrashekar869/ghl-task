const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const glob = require('glob');
const path = require('path');
const http = require('http');
const cors = require('cors');

const { logger } = require('./loggers/winston.logger');

// Define all the cors options here
const corsOptions = {
  origin: true,
  credentials: true,
  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type', 'x-api-key',
  ],
};

module.exports = () => {
  // Initialize express
  const app = express();
  app.set('view cache', false);

  // Initialize log streams
  logger.stream = {
    write(message) {
      logger.info(message);
    },
  };
  console.log(path.join(__dirname, 'static').replace(/\\/g, '/'));
  app.use(express.static(path.join(__dirname, 'static').replace(/\\/g, '/')));
  app.use(morgan(':date[web] :method :url :status :remote-addr :remote-user', { stream: logger.stream }));

  if (process.env.NODE_ENV.trim() === 'debug') {
    // Perform all operations for debug and dev here
  } else if (process.env.NODE_ENV.trim() === 'prod') {
    // Perform all operations for prod here
  }

  // Initialize cors options
  app.use(cors(corsOptions));

  // Extend body parser
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(bodyParser.json());

  // Using helmet to safeguard against standard vulnerabilities
  app.use(
    helmet({
      frameguard: false,
    }),
  );
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use((req, res, next) => {
    req.logger = logger;
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.removeHeader('X-Frame-Options');
    next();
  });

  // Health check route. Needed by deployment managers
  app.get('/health', (req, res) => {
    res.send({ message: 'Up and working' });
  });

  // Import subpaths
  glob.sync(`${path.join(__dirname, '../app', 'routes')}/*.js`.replace(/\\/g, '/')).forEach((routePath) => {
    // eslint-disable-next-line global-require
    require(path.resolve(routePath))(app); // eslint-disable-line import/no-dynamic-require
  });

  // Generic handle for unknown routes
  app.get('*', (req, res, next) => {
    if (!res.locals.processed) {
      res.status(404).send({ message: 'Oops, Route not found!' });
    } else {
      next();
    }
  });

  // * Global error handling
  app.use((err, req, res, next) => {
    let errorType = err.type;
    if (err.isJoi) {
      errorType = 400;
    }
    if (err) {
      if (err.noData) {
        res.status(200).send({ message: 'Data not available!', data: [] });
      } else {
        res.status(errorType || 500).send({ message: err.message, data: [] });
      }
    }
    next();
  });

  // Initialize http server with express
  const server = http.createServer(app);
  app.set('server', server);

  // Return Express server instance
  return app;
};
