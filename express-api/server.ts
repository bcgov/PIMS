import logger from './utilities/winstonLogger';
import constants from './constants';
import app from './express';
import 'reflect-metadata';
import { myDataSource } from './app-data-source';

const { API_PORT } = constants;

app.listen(API_PORT, (err?: Error) => {
  if (err) logger.error(err);
  logger.info(`Server started on port ${API_PORT}.`);
});

// creating connection to database
myDataSource
  .initialize()
  .then(() => {
    logger.info("Database connection has been initialized")
  })
  .catch((err) => {
    logger.info("Error during data source initialization")
  })
