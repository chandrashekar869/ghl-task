const router = require('express').Router();

router.get('/route', (request, response) => {
  request.logger.info('Request received');
  response.locals.processed = true;
  response.send('Working test');
});

module.exports = (app) => {
  app.use('/test', router);
};
