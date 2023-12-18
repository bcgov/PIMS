import logger from './utilities/winstonLogger';
import constants from './constants';
import app from './express';
import { AppDataSource } from './appDataSource';

const { API_PORT } = constants;

app.listen(API_PORT, (err?: Error) => {
  if (err) logger.error(err);
  logger.info(`Server started on port ${API_PORT}.`);
});

// creating connection to database
AppDataSource.initialize()
  .then(() => {
    logger.info('Database connection has been initialized');
  })
  .catch((err?: Error) => {
    logger.error('Error during data source initialization. With error: ', err);
  });
