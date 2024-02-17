import logger from '@/utilities/winstonLogger';
import constants from '@/constants';
import app from '@/express';
import { AppDataSource } from '@/appDataSource';
import { Application } from 'express';
import { Server } from 'http';
import { Socket } from 'net';

const { API_PORT } = constants;

// let activeConnections: Socket[] = [];

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

let server: Server;
(async () => {
  server = await startApp(app);
})();

// server.on('connection', connection => {
//   activeConnections.push(connection);
//   connection.on('close', () => activeConnections = activeConnections.filter(curr => curr !== connection));
// })
// Error catching listeners
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception: ', err.message);
  AppDataSource.destroy();
  console.log('Closing server now...');
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  AppDataSource.destroy();
  console.log('Closing server now...');
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully');
  await AppDataSource.destroy();
  console.log('Closing server now...');
  server.closeAllConnections();
  server.close(() => {
    // activeConnections.forEach(curr => curr.end());
    // activeConnections.forEach(curr => curr.destroy());
    // process.exit(0);
  });
  server = await startApp(app);
});
