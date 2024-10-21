import { format, createLogger, transports } from 'winston';
import constants from '@/constants';

const { timestamp, combine, json, prettyPrint } = format;
const { TESTING } = constants;

/**
 * Creates a logger object that can be called to generate log messages.
 * Log messages are formatted as JSON.
 * @returns {Logger} A Logger instance from winston.
 * @example
 * logger.info("Here's some info!");
 * logger.warn("Here's a warning!");
 * logger.error("Here's an error!");
 */
const logger = createLogger({
  level: 'http', // Defines a custom level
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    json(),
    format.errors({ stack: true }),
    prettyPrint(),
  ),
  transports: [new transports.Console()],
  silent: TESTING,
});

export default logger;
