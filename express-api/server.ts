import logger from './utilities/winstonLogger';
import constants from './constants';
import app from './express';
import "reflect-metadata";

const { API_PORT } = constants;

app.listen(API_PORT, (err?: Error) => {
  if (err) logger.error(err);
  logger.info(`Server started on port ${API_PORT}.`);
});
