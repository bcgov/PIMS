import KeycloakService from '@/services/keycloak/keycloakService';
import logger from '@/utilities/winstonLogger';
import cron from 'node-cron';

/**
 * Runs a cron job to sync Keycloak roles at regular intervals.
 * The cron job is scheduled to run every 10 minutes.
 * Logs the start and completion of the sync process along with any errors encountered.
 */
const cronSyncKeycloakRoles = () => {
  // minute, hour, day of month, month, day of week
  const cronSchedule = '*/10 * * * *'; // Every 10 minutes
  cron.schedule(cronSchedule, async () => {
    logger.info(`Starting Sync Keycloak Roles routine at ${new Date().toISOString()}.`);
    try {
      await KeycloakService.syncKeycloakRoles();
      logger.info(`Sync Keycloak Roles routine complete at ${new Date().toISOString()}.`);
    } catch (e) {
      logger.warn(e.message);
    }
  });
};

export default cronSyncKeycloakRoles;
