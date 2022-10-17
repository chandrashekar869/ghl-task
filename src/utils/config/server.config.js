module.exports = {
  app: {
    title: 'ghl-backend',
  },
  port: process.env.EXPRESS_PORT || 8085,
  hostname: process.env.EXPRESS_IP || 'localhost',
};
