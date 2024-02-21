import logger from '@/utilities/winstonLogger';
import constants from '@/constants';
import app from '@/express';
import { AppDataSource } from '@/appDataSource';
import { Application } from 'express';
import { IncomingMessage, Server, ServerResponse } from 'http';

const { API_PORT } = constants;

const startApp = async (app: Application) => {
  // activeConnections = [];
  const server = app.listen(API_PORT, (err?: Error) => {
    if (err) logger.error(err);
    logger.info(`Server started on port ${API_PORT}.`);
  });

  // creating connection to database
  await AppDataSource.initialize()
    .then(() => {
      logger.info('Database connection has been initialized');
    })
    .catch((err?: Error) => {
      logger.error('Error during data source initialization. With error: ', err);
    });

  return server;
};

let server: Server<typeof IncomingMessage, typeof ServerResponse>;
(async () => {
  server = await startApp(app);
})();

const stopApp = async (exitCode: number, e?: string) => {
  logger.warn('Closing database connection.');
  await AppDataSource.destroy();
  logger.warn('Closing user connections.');
  server.closeAllConnections();
  server.close(() => {
    logger.error(`Express application terminated. ${e ?? 'unknown'}`);
    process.exit(exitCode);
  });
};

// Error catching listeners
process.on('uncaughtException', (err: Error) => {
  logger.warn('Uncaught exception received. Shutting down gracefully.');
  stopApp(1, `Uncaught exception: ${err.stack}`);
});

process.on('unhandledRejection', (err: Error) => {
  logger.warn('Unhandled rejection received. Shutting down gracefully.');
  stopApp(1, `Unhandled rejection: ${err.stack}`);
});

process.on('SIGTERM', () => {
  logger.warn('SIGTERM received. Shutting down gracefully.');
  stopApp(0, 'SIGTERM request.');
});
