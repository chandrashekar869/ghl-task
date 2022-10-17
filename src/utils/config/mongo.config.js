// This module helps to manipulate mongo information

const errorCodes = {
  11000: {
    status: 400,
    message: 'Duplicate entry. Record already exists',
  },
};

const config = {
  port: process.env.MONGODB_PORT || 27017,
  hostname: process.env.MONGODB_HOST || 'localhost',
  username: process.env.MONGODB_USERNAME,
  password: process.env.MONGODB_PASSWORD,
  prerequisites: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

const getConnectionString = () => `mongodb://${config.hostname}:${config.port}`;

module.exports = {
  getConnectionString,
  mongoConfig: config,
  errorCodes,
};
