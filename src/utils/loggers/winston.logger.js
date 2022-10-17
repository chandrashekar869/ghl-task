// Define all logger functionalities here
// Can integrate to slack or any 3rd party service to log

const { createLogger, transports, format } = require('winston');

// Creating a logger for logging to console
const logger = createLogger({
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(format.json(), format.timestamp()),
    }),
  ],
});

module.exports = {
  logger,
};
