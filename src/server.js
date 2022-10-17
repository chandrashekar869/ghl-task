// Initialize .env files.
// TODO: Need to seperate for prod and test
require('dotenv').config();

const { logger } = require('./utils/loggers/winston.logger');
const config = require('./utils/config/server.config');
const { connectToDatabase } = require('./app/db/index');
const app = require('./utils/express')();

// Handle uncaught exceptions globally
process.on('uncaughtException', (err) => logger.error(`Uncaught Exception: ${err.message}`, { userInfo: global.winstonLogger }));

// Start express server
connectToDatabase()
  .then(() => {
    app.get('server').listen(config.port, config.hostname, () => {
      logger.info(`Server started on ${config.hostname}:${config.port}`);
    });
  })
  .catch((error) => {
    logger.error(`Failed to Start Server: ${error.message}`);
  });
