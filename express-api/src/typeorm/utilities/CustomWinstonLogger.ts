import { AbstractLogger, LogLevel, LogMessage } from 'typeorm';
import logger from '@/utilities/winstonLogger';

export class CustomWinstonLogger extends AbstractLogger {
  /**
   * Write Winston Logs for TypeORM actions
   */
  protected writeLog(level: LogLevel, logMessage: LogMessage | LogMessage[]) {
    const messages = this.prepareLogMessages(logMessage, {
      highlightSql: false,
    });

    for (const message of messages) {
      switch (message.type ?? level) {
        case 'log':
        case 'schema-build':
        case 'migration':
          logger.info(message.message);
          break;

        case 'info':
        case 'query':
          if (message.prefix) {
            logger.info(`${message.prefix} ${message.message}`);
          } else {
            logger.info(message.message);
          }
          break;

        case 'warn':
        case 'query-slow':
          if (message.prefix) {
            logger.warn(`${message.prefix} ${message.message}`);
          } else {
            logger.warn(message.message);
          }
          break;

        case 'error':
        case 'query-error':
          if (message.prefix) {
            logger.error(`${message.prefix} ${message.message}`);
          } else {
            logger.error(message.message);
          }
          break;
      }
    }
  }
}
