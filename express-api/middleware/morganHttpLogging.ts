import morgan from 'morgan';
import logger from '../utilities/winstonLogger';

/**
 * Middleware function that configures Morgan to use a custom logger with the http severity.
 * It takes a message as input, trims it, and then splits it into parts to create a JSON object.
 * Finally, it uses the winston logger to log the HTTP call.
 */
const morganMiddleware = morgan(':method :url :status :response-time', {
  stream: {
    // Configure Morgan to use our custom logger with the http severity
    write: (message) => {
      const trimmedMessage = message.trim(); // Because there's a \n at the end.
      // Break message from morgan into parts for JSON
      const method = trimmedMessage.split(' ').at(0);
      const route = trimmedMessage.split(' ').at(1);
      const status = +trimmedMessage.split(' ').at(2);
      const responseTime = +trimmedMessage.split(' ').at(3);
      const morganJSON = {
        method,
        route,
        status,
        responseTimeMs: responseTime,
      };
      // Use the winston logger to log http call
      logger.http(morganJSON);
    },
  },
});

export default morganMiddleware;
